"use client";
// Adapté pour Biotrace :
// - contenu en props (liens, textes, bloc libre `aside`, niveau de titre) ;
// - globe : carte du monde importée localement (paquet world-atlas, aucun appel réseau),
//   marqueurs (ex. Montpellier), rotation coupée si l'utilisateur réduit les animations ;
// - formulaire honnête : sans service d'envoi, il prépare un e-mail dans la messagerie
//   de l'utilisateur (mailto) — il n'affiche jamais un faux « message envoyé » ;
//   `form.action` permet de le relier plus tard à un vrai service ;
// - champs reliés à leurs libellés ; `motion/react` -> framer-motion (déjà installé) ;
// - séparateur décoratif sans dépendance Radix.

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Headphones } from "lucide-react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection, GeometryObject } from "topojson-specification";
import type { GeoPermissibleObjects } from "d3";
import worldAtlas from "world-atlas/countries-110m.json";
import { cn } from "@/lib/utils";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export type ContactLink = { icon: React.ElementType; label: string; href: string };

const DEFAULT_LINKS: ContactLink[] = [
  { icon: Mail, label: "contact@yoursaas.ai", href: "mailto:contact@yoursaas.ai" },
  { icon: Phone, label: "+1 (800) 321 XX21", href: "tel:+18003214321" },
  { icon: Headphones, label: "support@yoursaas.ai", href: "mailto:support@yoursaas.ai" },
];

export type GlobeMarker = { label: string; coordinates: [number, number] /* [lat, lon] */ };

interface GlobeWireframeProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  rotateToLocation?: string | [number, number];
  rotateCities?: string[];
  rotationSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  showGraticule?: boolean;
  startAsGlobe?: boolean;
  countryFillColor?: string;
  countryHoverColor?: string;
  variant?: "wireframe" | "wireframesolid" | "solid";
  scale?: number;
  backgroundColor?: string;
  markers?: GlobeMarker[];
  markerColor?: string;
}

interface GeoFeature {
  type: string;
  geometry: GeometryObject;
  properties: Record<string, unknown>;
}

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

interface CustomProjection extends d3.GeoProjection {
  alpha(value: number): CustomProjection;
  alpha(): number;
}

const cityCoordinates: Record<string, [number, number]> = {
  "san francisco": [37.7749, -122.4194],
  "new york": [40.7128, -74.006],
  london: [51.5074, -0.1278],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  montpellier: [43.6108, 3.8767],
  moscow: [55.7558, 37.6176],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.076, 72.8777],
  "los angeles": [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
};

function orthographicRaw(x: number, y: number): [number, number] {
  const cosy = Math.cos(y);
  return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda: number, phi: number): [number, number] {
  return [lambda, phi];
}

function interpolateProjection(
  raw0: (lambda: number, phi: number) => [number, number],
  raw1: (lambda: number, phi: number) => [number, number],
): CustomProjection {
  let t = 0;
  const createRawProjection = (alpha: number) => (lambda: number, phi: number): [number, number] => {
    const [x0, y0] = raw0(lambda, phi);
    const [x1, y1] = raw1(lambda, phi);
    return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)];
  };
  const projection = d3.geoProjection(createRawProjection(t)) as unknown as CustomProjection;
  const alphaMethod = ((value?: number): CustomProjection | number => {
    if (value !== undefined) {
      t = +value;
      const newProjection = d3.geoProjection(createRawProjection(t)) as unknown as CustomProjection;
      if (projection.scale()) newProjection.scale(projection.scale());
      if (projection.translate()) newProjection.translate(projection.translate());
      if (projection.rotate()) newProjection.rotate(projection.rotate());
      if (projection.precision()) newProjection.precision(projection.precision());
      newProjection.alpha = alphaMethod as CustomProjection["alpha"];
      return newProjection;
    }
    return t;
  }) as CustomProjection["alpha"];
  projection.alpha = alphaMethod;
  return projection;
}

const COUNTRIES: GeoFeature[] = (() => {
  const world = worldAtlas as unknown as WorldAtlasTopology;
  return feature(world, world.objects.countries).features as unknown as GeoFeature[];
})();

export function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-150",
  strokeColor = "currentColor",
  strokeWidth = 1.0,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.2,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  rotateToLocation,
  rotateCities = [],
  rotationSpeed = 3000,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  startAsGlobe = true,
  countryFillColor,
  countryHoverColor,
  variant = "wireframe",
  scale = 1,
  backgroundColor,
  markers = [],
  markerColor = "#c8f56a",
}: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = startAsGlobe ? 0 : 100;
  const worldData = COUNTRIES;
  const [rotation, setRotation] = useState<[number, number]>(() => {
    if (!rotateToLocation) return initialRotation;
    const c = typeof rotateToLocation === "string" ? cityCoordinates[rotateToLocation.toLowerCase()] || [0, 0] : rotateToLocation;
    return [-c[1], -c[0]];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationAnimFrame = useRef<number | null>(null);
  const rotationStartTime = useRef<number | null>(null);
  const rotationFrom = useRef<[number, number]>([0, 0]);
  const rotationTo = useRef<[number, number]>([0, 0]);
  const animationFrame = useRef<number | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultStrokeColor = strokeColor || "currentColor";
  const defaultGraticuleColor = graticuleColor || "currentColor";
  const defaultSphereOutlineColor = sphereOutlineColor || "currentColor";
  const defaultCountryFillColor = countryFillColor || (variant === "solid" ? "currentColor" : "none");
  const defaultBackgroundColor = backgroundColor || "transparent";

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const updateDimensions = () => {
      if (container && useResponsive) {
        const w = container.offsetWidth || 300;
        setDimensions({ width: w, height: w });
      }
    };
    updateDimensions();
    if (useResponsive) {
      resizeObserver.current = new ResizeObserver(updateDimensions);
      resizeObserver.current.observe(container);
    }
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(container);
    return () => {
      resizeObserver.current?.disconnect();
      observer.unobserve(container);
    };
  }, [useResponsive]);

  useEffect(() => {
    if (!autoRotate || reduced || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }
    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };
    animationFrame.current = requestAnimationFrame(rotate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length, reduced]);

  const animateRotationTo = useCallback((target: [number, number], duration = 1200) => {
    if (rotationAnimFrame.current) cancelAnimationFrame(rotationAnimFrame.current);
    rotationFrom.current = rotationRef.current;
    rotationTo.current = target;
    rotationStartTime.current = performance.now();
    const animate = (time: number) => {
      const elapsed = time - (rotationStartTime.current || 0);
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const lon = rotationFrom.current[0] + (rotationTo.current[0] - rotationFrom.current[0]) * eased;
      const lat = rotationFrom.current[1] + (rotationTo.current[1] - rotationFrom.current[1]) * eased;
      setRotation([lon, lat]);
      if (t < 1) rotationAnimFrame.current = requestAnimationFrame(animate);
    };
    rotationAnimFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;
    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length;
      const coordinates = cityCoordinates[rotateCities[nextIndex].toLowerCase()];
      if (coordinates) {
        animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
        setCurrentCityIndex(nextIndex);
      }
    };
    const coordinates = cityCoordinates[rotateCities[currentCityIndex].toLowerCase()];
    if (coordinates) animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed);
    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [rotateCities, currentCityIndex, rotationSpeed, isVisible, animateRotationTo]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableInteraction) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];
    const t = progress / 100;
    const sensitivity = variant === "wireframe" ? (t < 0.5 ? 0.5 : 0.25) : 0.5;
    setRotation((prev) => [prev[0] + dx * sensitivity, Math.max(-90, Math.min(90, prev[1] - dy * sensitivity))]);
    setLastMouse(currentMouse);
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0 || !isVisible) return;
    if (useResponsive && dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let finalCountryFill = "none";
    let finalStrokeWidth = strokeWidth;
    let finalOpacity = 1.0;
    let renderGraticule = showGraticule;
    let finalGraticuleOpacity = graticuleOpacity;
    let finalSphereOutlineWidth = sphereOutlineWidth;

    if (variant === "wireframesolid") {
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    } else if (variant === "solid") {
      finalCountryFill = defaultCountryFillColor;
      finalStrokeWidth = strokeWidth * 0.5;
      finalOpacity = 0.3;
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    }

    if (defaultBackgroundColor !== "transparent") {
      const radius = (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9;
      svg.append("circle").attr("cx", finalWidth / 2).attr("cy", finalHeight / 2).attr("r", radius).attr("fill", defaultBackgroundColor);
    }

    let projection: d3.GeoProjection | CustomProjection;
    const path = d3.geoPath();

    if (variant === "wireframe") {
      const alpha = Math.pow(progress / 100, 0.5);
      const baseScale = Math.min(finalWidth, finalHeight) / 2;
      const scaleRange = d3.scaleLinear().domain([0, 1]).range([baseScale * 0.9 * scale, baseScale * 0.54 * scale]);
      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha))
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1);
      (projection as CustomProjection).alpha(alpha);
      path.projection(projection);
    } else {
      projection = d3
        .geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1);
      path.projection(projection);
    }

    if (renderGraticule && finalGraticuleOpacity > 0) {
      const graticule = d3.geoGraticule();
      const graticulePath = path(graticule());
      if (graticulePath) {
        svg
          .append("path")
          .datum(graticule())
          .attr("d", graticulePath)
          .attr("fill", "none")
          .attr("stroke", defaultGraticuleColor)
          .attr("stroke-width", 1)
          .attr("opacity", finalGraticuleOpacity);
      }
    }

    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d: GeoFeature) => {
        try {
          const pathString = path(d as unknown as GeoPermissibleObjects);
          if (!pathString || pathString.includes("NaN") || pathString.includes("Infinity")) return "";
          return pathString;
        } catch {
          return "";
        }
      })
      .attr("fill", finalCountryFill)
      .attr("stroke", defaultStrokeColor)
      .attr("stroke-width", finalStrokeWidth)
      .attr("opacity", finalOpacity)
      .on("mouseenter", function (this: SVGPathElement) {
        if (countryHoverColor && variant === "solid") d3.select(this).attr("fill", countryHoverColor);
      })
      .on("mouseleave", function (this: SVGPathElement) {
        if (variant === "solid") d3.select(this).attr("fill", finalCountryFill);
      });

    const sphereOutline = path({ type: "Sphere" });
    if (sphereOutline) {
      svg
        .append("path")
        .datum({ type: "Sphere" })
        .attr("d", sphereOutline)
        .attr("fill", "none")
        .attr("stroke", defaultSphereOutlineColor)
        .attr("stroke-width", finalSphereOutlineWidth)
        .attr("opacity", variant === "wireframe" ? 1.0 : 0.8);
    }

    // Marqueurs : affichés seulement sur la face visible du globe
    const center: [number, number] = [-rotation[0], -rotation[1]];
    markers.forEach((m) => {
      const lonLat: [number, number] = [m.coordinates[1], m.coordinates[0]];
      if (d3.geoDistance(lonLat, center) > Math.PI / 2 - 0.05) return;
      const p = projection(lonLat);
      if (!p) return;
      const g = svg.append("g").attr("transform", `translate(${p[0]},${p[1]})`);
      g.append("circle").attr("r", 11).attr("fill", markerColor).attr("opacity", 0.35).attr("class", "globe-marker-pulse");
      g.append("circle").attr("r", 4.5).attr("fill", markerColor).attr("stroke", "currentColor").attr("stroke-width", 1.5);
      g.append("text")
        .attr("x", 10)
        .attr("y", -10)
        .attr("fill", "currentColor")
        .attr("font-size", 12)
        .attr("font-weight", 700)
        .text(m.label);
    });
  }, [
    worldData,
    progress,
    rotation,
    isVisible,
    finalWidth,
    finalHeight,
    defaultStrokeColor,
    strokeWidth,
    defaultGraticuleColor,
    graticuleOpacity,
    defaultSphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    defaultCountryFillColor,
    countryHoverColor,
    variant,
    scale,
    defaultBackgroundColor,
    useResponsive,
    dimensions.width,
    markers,
    markerColor,
  ]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={finalWidth}
        height={finalHeight}
        aria-hidden="true"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={useResponsive ? "w-full h-full transition-opacity duration-1000" : ""}
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1,
        }}
      />
    </div>
  );
}

/** Séparateur pointillé, purement décoratif. */
function FormDots({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-4 w-full shrink-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-repeat text-current opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
          backgroundSize: "6px 100%",
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />
    </div>
  );
}

export interface ContactWithGlobeProps {
  title?: React.ReactNode;
  subtitle?: string;
  description?: React.ReactNode;
  headingLevel?: "h1" | "h2";
  headingId?: string;
  links?: ContactLink[];
  introTitle?: string;
  introText?: string;
  /** Contenu supplémentaire sous les liens (adresse, message aux professionnels…). */
  aside?: React.ReactNode;
  globe?: Partial<GlobeWireframeProps>;
  form?: {
    /** Adresse qui recevra l'e-mail préparé (mode mailto). */
    mailto?: string;
    /** URL d'un vrai service d'envoi : le formulaire y est alors soumis normalement. */
    action?: string;
    title?: string;
    text?: string;
    submitLabel?: string;
    note?: string;
    labels?: { name?: string; company?: string; email?: string; message?: string };
    placeholders?: { name?: string; company?: string; email?: string; message?: string };
    subjectPrefix?: string;
  };
  className?: string;
  /** Classes de l'accent (badge, survols, focus). */
  accentClassName?: string;
}

const fieldClass =
  "w-full rounded-xl border-[1.5px] border-ink/25 bg-paper/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-all duration-200 focus:border-lab-blue focus:ring-2 focus:ring-lab-blue/20";

export default function ContactWithGlobe({
  title = "Contact us",
  subtitle = "Contact",
  description = "We are always looking for ways to improve our products and services. Contact us and let us know how we can help you.",
  headingLevel = "h2",
  headingId,
  links = DEFAULT_LINKS,
  introTitle = "Get in touch",
  introText = "Reach out via any channel below. We typically reply within one business day.",
  aside,
  globe,
  form = {},
  className,
}: ContactWithGlobeProps) {
  const Heading = headingLevel;
  const formId = React.useId();
  const [status, setStatus] = useState<string | null>(null);
  const labels = { name: "Full Name", company: "Company", email: "Email Address", message: "Message", ...form.labels };
  const placeholders = { name: "", company: "", email: "", message: "Type your message here", ...form.placeholders };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (form.action) return; // envoi normal vers le service
    e.preventDefault();
    if (!form.mailto) return;
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `${form.subjectPrefix ?? "Message"}${name ? ` — ${name}` : ""}${company ? ` (${company})` : ""}`;
    const body = `${message}\n\n—\n${[name, company, email].filter(Boolean).join("\n")}`;
    window.location.href = `mailto:${form.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(form.note ?? "Votre messagerie s’ouvre avec le message prêt à être envoyé.");
  };

  return (
    <section className={cn("relative w-full overflow-hidden py-20", className)}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="etiquette inline-flex items-center rounded-full border-[1.5px] border-lab-blue/50 bg-lab-blue/10 px-4 py-1.5 text-lab-blue"
          >
            {subtitle}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
          >
            <Heading id={headingId} className="titre-affiche text-5xl sm:text-6xl lg:text-7xl">
              {title}
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="max-w-xl text-lg text-ink-soft"
          >
            {description}
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-ink">{introTitle}</h2>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{introText}</p>
            </div>

            <ul className="flex flex-col gap-3">
              {links.map(({ icon: Icon, label, href }, i) => {
                const external = href.startsWith("http");
                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                  >
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex w-fit items-center gap-3 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:text-lab-blue"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink/25 bg-[#fffdf7] transition-all duration-200 group-hover:border-lab-blue group-hover:bg-lab-lime">
                        <Icon aria-hidden className="size-4 text-ink" />
                      </span>
                      {label}
                      {external && <span className="sr-only"> (nouvel onglet)</span>}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            {aside}

            <div className="relative h-64 overflow-hidden text-ink">
              <GlobeWireframe
                className="absolute top-0 left-0 aspect-square w-full max-w-full"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.2}
                strokeWidth={0.6}
                graticuleOpacity={0.12}
                {...globe}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="carte flex flex-col gap-5 p-6 sm:p-8"
          >
            <div>
              <h2 className="mb-0.5 text-lg font-bold text-ink">{form.title ?? "Send a message"}</h2>
              <p className="text-sm text-ink-soft">{form.text ?? "Fill out the form and we'll get back to you promptly."}</p>
            </div>

            <FormDots className="text-ink" />

            <form action={form.action} method={form.action ? "post" : undefined} onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${formId}-name`} className="etiquette font-bold text-ink-soft">
                    {labels.name}
                  </label>
                  <input id={`${formId}-name`} name="name" type="text" autoComplete="name" placeholder={placeholders.name} className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${formId}-company`} className="etiquette font-bold text-ink-soft">
                    {labels.company}
                  </label>
                  <input
                    id={`${formId}-company`}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder={placeholders.company}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`${formId}-email`} className="etiquette font-bold text-ink-soft">
                  {labels.email}
                </label>
                <input id={`${formId}-email`} name="email" type="email" autoComplete="email" placeholder={placeholders.email} className={fieldClass} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`${formId}-message`} className="etiquette font-bold text-ink-soft">
                  {labels.message}
                </label>
                <textarea
                  id={`${formId}-message`}
                  name="message"
                  required
                  placeholder={placeholders.message}
                  rows={5}
                  className={cn(fieldClass, "resize-none py-3")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <button type="submit" className="bouton bouton-noir group w-fit">
                  {form.submitLabel ?? "Submit"}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                {form.note && !status && <p className="text-xs text-ink-soft">{form.note}</p>}
                <p role="status" aria-live="polite" className="text-sm font-semibold text-lab-green-deep">
                  {status}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
