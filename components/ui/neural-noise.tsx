"use client"

import { useEffect, useRef } from "react"

type NeuralNoiseProps = {
  /** Couleur RVB (0 à 1). */
  color?: [number, number, number]
  opacity?: number
  speed?: number
  /**
   * false (défaut) : canvas plein écran en position fixe, comme le composant d'origine.
   * true : le canvas remplit son conteneur parent (qui doit être en position relative).
   */
  contained?: boolean
  className?: string
}

const vsSource = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fsSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform vec3 u_color;
  uniform float u_speed;
  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }
  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.0);
    vec2 res = vec2(0.0);
    float scale = 8.0;
    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.0);
      sine_acc = rotate(sine_acc, 1.0);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer) + 2.4 * p;
      res += (0.5 + 0.5 * cos(layer)) / scale;
      scale *= 1.2;
    }
    return res.x + res.y;
  }
  void main() {
    vec2 uv = 0.5 * vUv;
    uv.x *= u_ratio;
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0.0, 1.0);
    p = 0.5 * pow(1.0 - p, 2.0);
    float t = u_speed * u_time;
    vec3 col = vec3(0.0);
    float noise = neuro_shape(uv, t, p);
    noise = 1.2 * pow(noise, 3.0);
    noise += pow(noise, 10.0);
    noise = max(0.0, noise - 0.5);
    noise *= (1.0 - length(vUv - 0.5));
    col = u_color * noise;
    gl_FragColor = vec4(col, noise);
  }
`

function createShader(gl: WebGLRenderingContext, source: string, type: number) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program))
    return null
  }
  return program
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
  const uniforms: Record<string, WebGLUniformLocation | null> = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name)
  }
  return uniforms
}

export function NeuralNoise({
  color = [0.9, 0.2, 0.4],
  opacity = 0.95,
  speed = 0.001,
  contained = false,
  className,
}: NeuralNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [r, g, b] = color

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null
    if (!gl) {
      console.error("WebGL not supported")
      return
    }
    const vs = createShader(gl, vsSource, gl.VERTEX_SHADER)
    const fs = createShader(gl, fsSource, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return
    const program = createProgram(gl, vs, fs)
    if (!program) return
    const uniforms = getUniforms(gl, program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    gl.uniform3f(uniforms.u_color, r, g, b)
    gl.uniform1f(uniforms.u_speed, speed)

    // Zone de référence : la fenêtre (plein écran) ou le canvas lui-même (mode conteneur).
    const zone = () =>
      contained ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const { width, height } = zone()
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const z0 = zone()
    const pointer = { x: z0.width / 2, y: z0.height / 2, tX: z0.width / 2, tY: z0.height / 2 }
    const setPointer = (clientX: number, clientY: number) => {
      const { left, top } = zone()
      pointer.tX = clientX - left
      pointer.tY = clientY - top
    }
    const onPointer = (e: PointerEvent | MouseEvent) => setPointer(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.targetTouches[0]
      if (t) setPointer(t.clientX, t.clientY)
    }

    // « Réduire les animations » : une seule image fixe, sans suivi du pointeur.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    const draw = (time: number) => {
      const { width, height } = zone()
      pointer.x += (pointer.tX - pointer.x) * 0.2
      pointer.y += (pointer.tY - pointer.y) * 0.2
      gl.uniform1f(uniforms.u_time, time)
      gl.uniform2f(uniforms.u_pointer_position, pointer.x / width, 1 - pointer.y / height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const loop = () => {
      draw(performance.now())
      frame = requestAnimationFrame(loop)
    }

    resize()
    const observer = contained ? new ResizeObserver(resize) : null
    observer?.observe(canvas)
    window.addEventListener("resize", resize)
    if (reduced) {
      draw(12000)
    } else {
      window.addEventListener("pointermove", onPointer)
      window.addEventListener("touchmove", onTouch, { passive: true })
      window.addEventListener("click", onPointer)
      loop()
    }

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("click", onPointer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [r, g, b, speed, contained])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: contained ? "absolute" : "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    />
  )
}
