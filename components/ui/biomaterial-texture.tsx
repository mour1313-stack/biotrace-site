"use client"

import { useEffect, useRef } from "react"

/**
 * Texture de biomatériau générée en WebGL : membrane poreuse en nid d'abeille,
 * pliée en vague, avec un flou de profondeur vers le haut.
 * Remplit son conteneur parent (qui doit être en position relative).
 */

const vsSource = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

const fsSource = `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;
  uniform vec2 u_pointer;
  uniform float u_sphere;

  float hash1(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
  }
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  // Voronoï : x = F1, y = F2, z = identifiant aléatoire de la cellule la plus proche
  vec3 voronoi(vec2 x, float t) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float f1 = 8.0;
    float f2 = 8.0;
    float id = 0.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        o = 0.5 + 0.36 * sin(t + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < f1) { f2 = f1; f1 = d; id = hash1(n + g); }
        else if (d < f2) { f2 = d; }
      }
    }
    return vec3(sqrt(f1), sqrt(f2), id);
  }

  // Profil d'un pore : 0 au centre du trou, ~0.5 sur la paroi. Taille variable par cellule.
  float poreRatio(vec3 v) { return v.x / (v.x + v.y); }
  float poreSeuil(vec3 v) { return 0.34 + 0.09 * (v.z - 0.5); }

  float fold(vec2 p, float t) {
    return 0.60 * sin(p.x * 1.6 - p.y * 2.4 + 0.9 + t * 0.25)
         + 0.22 * sin(p.x * 3.7 + p.y * 1.9 - t * 0.18)
         + 0.08 * sin(p.x * 7.0 - p.y * 5.0 + t * 0.30);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    vec2 p = vec2(uv.x * asp, uv.y);
    float t = u_time;

    // Mode sphère : coordonnées bombées (projection sur une boule) qui défilent lentement
    vec2 sd = uv - 0.5;
    float sr = length(sd) * 2.0;
    float sz = sqrt(max(0.0, 1.0 - sr * sr));
    if (u_sphere > 0.5) {
      p = sd / (0.35 + sz) * 0.9 + vec2(0.5 + t * 0.035, 0.5);
    }

    vec2 pp = vec2(u_pointer.x * asp, u_pointer.y);
    float bump = 0.15 * exp(-6.0 * dot(p - pp, p - pp));

    float h = fold(p, t) + bump;
    float e = 0.003;
    float hx = (fold(p + vec2(e, 0.0), t) - fold(p - vec2(e, 0.0), t)) / (2.0 * e);
    float hy = (fold(p + vec2(0.0, e), t) - fold(p - vec2(0.0, e), t)) / (2.0 * e);
    vec3 nrm = normalize(vec3(-hx * 0.55, -hy * 0.55, 1.0));
    vec3 L = normalize(vec3(-0.5, 0.7, 0.6));
    float light = clamp(dot(nrm, L), 0.0, 1.0);
    light = mix(light, clamp(dot(normalize(vec3(sd * 2.0, sz + 0.05)), L) * 0.8 + 0.25, 0.0, 1.0), u_sphere);

    float edgeLine = 0.86 - 0.34 * uv.x + 0.08 * h;
    float membrane = mix(1.0 - smoothstep(edgeLine - 0.035, edgeLine + 0.05, uv.y), 1.0, u_sphere);

    // Profondeur de champ : net au premier plan, flou vers le haut
    // Sphère : net au centre, légèrement flou sur les bords (effet de courbure)
    float depth = mix(smoothstep(0.12, 0.95, uv.y), 0.12 + 0.45 * smoothstep(0.55, 1.0, sr), u_sphere);
    float aa = mix(0.018, 0.16, depth);

    // --- Couche avant ---
    float scale = mix(6.5, 15.0, depth);
    vec2 q = p * vec2(scale, scale * 1.3) + vec2(h * 1.4, h * 2.2);
    float ct = t * 0.10;
    vec3 v = voronoi(q, ct);
    float r = poreRatio(v);
    float s = poreSeuil(v);
    float hole = 1.0 - smoothstep(s, s + aa, r);

    // Biseau des parois : on compare avec un point décalé vers la lumière
    vec3 vl = voronoi(q + L.xy * 0.035, ct);
    float bevel = clamp((poreRatio(vl) - r) * 9.0, -1.0, 1.0);
    // Hauteur de paroi : monte du bord du trou vers le milieu de la paroi
    float wallH = smoothstep(s, s + 0.16, r);

    // Ombre portée de la paroi dans le trou (lumière venant du haut-gauche)
    vec3 vs = voronoi(q + vec2(-0.07, 0.10), ct);
    float holeS = 1.0 - smoothstep(poreSeuil(vs), poreSeuil(vs) + aa, poreRatio(vs));
    float castShadow = hole * (1.0 - holeS);
    // Occlusion ambiante près du bord intérieur du trou
    float ao = hole * smoothstep(s - 0.16, s, r);

    // Micro-pores dans l'épaisseur des parois (net seulement au premier plan)
    vec3 vm = voronoi(q * 3.3 + 11.7, ct * 1.3);
    float micro = (1.0 - smoothstep(0.26, 0.26 + aa * 1.5, poreRatio(vm))) * (1.0 - hole) * wallH * (1.0 - depth);

    // --- Couche arrière, vue à travers les trous (parallaxe + plus floue) ---
    vec2 q2 = q * 0.82 + vec2(0.37, -0.21) + vec2(h * 0.35, -h * 0.25);
    vec3 vb = voronoi(q2, ct * 0.8);
    float rb = poreRatio(vb);
    float sb = poreSeuil(vb);
    float aab = aa + 0.08;
    float holeB = 1.0 - smoothstep(sb, sb + aab, rb);
    vec3 backWall = vec3(0.98, 0.93, 0.89);
    vec3 backHole = mix(vec3(0.94, 0.82, 0.73), vec3(0.90, 0.74, 0.64), 1.0 - smoothstep(0.0, sb, rb));
    vec3 inside = mix(backWall, backHole, holeB) * (0.86 + 0.14 * light);
    inside *= 1.0 - 0.20 * castShadow;
    inside *= 1.0 - 0.14 * ao;

    // Parois : blanc légèrement translucide, plus chaud près du bord (diffusion)
    vec3 wallCol = vec3(0.985, 0.978, 0.968);
    wallCol = mix(vec3(1.0, 0.92, 0.86), wallCol, 0.55 + 0.45 * wallH);
    wallCol *= 0.80 + 0.22 * light;
    wallCol += (bevel > 0.0 ? 0.09 : 0.05) * bevel * (1.0 - depth * 0.7);
    // Reflet doux sur le dessus des parois
    wallCol += 0.06 * pow(wallH, 3.0) * light;
    wallCol *= 1.0 - 0.09 * micro;

    vec3 surf = mix(wallCol, inside, hole);

    // Le lointain se fond dans une brume crème rosée
    surf = mix(surf, vec3(0.95, 0.92, 0.90) * (0.86 + 0.14 * light), smoothstep(0.55, 1.0, depth) * 0.7);

    // Arrière-plan : seconde membrane très floue + fond gris perle
    vec3 bg = mix(vec3(0.95, 0.93, 0.92), vec3(0.86, 0.87, 0.89), smoothstep(0.4, 1.0, uv.y));
    float far = smoothstep(0.30, 0.0, abs(uv.y - (0.82 - 0.12 * uv.x + 0.05 * sin(p.x * 2.0 + t * 0.2))));
    bg = mix(bg, vec3(0.98, 0.96, 0.95), far * 0.8);

    vec3 col = mix(bg, surf, membrane);

    float under = uv.y - edgeLine;
    col *= 1.0 - 0.07 * smoothstep(0.0, 0.10, under) * (1.0 - smoothstep(0.10, 0.28, under));

    // Vignettage léger et grain photo
    col *= 1.0 - 0.10 * pow(length(uv - vec2(0.45, 0.45)), 2.0);
    col += (hash1(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) * 0.018;

    gl_FragColor = vec4(col, 1.0);
  }
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

export function BiomaterialTexture({
  speed = 1,
  sphere = false,
  className,
}: {
  speed?: number
  /** Projette la texture sur une sphère (sans arrière-plan), pour un médaillon rond. */
  sphere?: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { antialias: true }) as WebGLRenderingContext | null
    if (!gl) return
    const vs = compile(gl, gl.VERTEX_SHADER, vsSource)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, "u_res")
    const uTime = gl.getUniformLocation(program, "u_time")
    const uPointer = gl.getUniformLocation(program, "u_pointer")
    gl.uniform1f(gl.getUniformLocation(program, "u_sphere"), sphere ? 1 : 0)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    // Pointeur hors champ par défaut (pas de bosse)
    const pointer = { x: -2, y: -2, tX: -2, tY: -2 }
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.tX = (e.clientX - r.left) / r.width
      pointer.tY = 1 - (e.clientY - r.top) / r.height
    }

    const draw = (time: number) => {
      pointer.x += (pointer.tX - pointer.x) * 0.08
      pointer.y += (pointer.tY - pointer.y) * 0.08
      gl.uniform1f(uTime, (time / 1000) * speed)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let visible = true
    const loop = () => {
      if (visible) draw(performance.now())
      frame = requestAnimationFrame(loop)
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw(4000)
    })
    ro.observe(canvas)
    // Pas de calcul quand la texture n'est pas à l'écran
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)

    if (reduced) {
      draw(4000)
    } else {
      window.addEventListener("pointermove", onPointer)
      loop()
    }

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onPointer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [speed, sphere])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  )
}
