"use client";
// Adapté pour Biotrace :
// - date, statut et « énergie » optionnels (affichés seulement s'ils sont fournis : pas de valeurs inventées) ;
// - nœuds = vrais boutons (clavier, aria-expanded), Échap pour fermer ;
// - rayon adapté à la largeur du conteneur, hauteur réglable (plus de h-screen) ;
// - pas de rotation automatique si l'utilisateur réduit les animations ;
// - centre et couleurs personnalisables (thème clair par défaut via les tokens shadcn) ;
// - libellés traduisibles. Le CSS global fourni n'est pas ajouté : il redéfinissait
//   des utilitaires Tailwind existants (.scale-125, .z-10, .transition-all…).
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: number;
  title: string;
  /** Petit libellé en haut de la fiche (date, numéro…). */
  date?: string;
  content: string;
  category?: string;
  icon: React.ElementType;
  relatedIds: number[];
  status?: "completed" | "in-progress" | "pending";
  /** 0–100 ; la jauge n'apparaît que si la valeur est fournie. */
  energy?: number;
  /** Classes du nœud (couleur de fond…), quand il n'est pas ouvert. */
  nodeClassName?: string;
  /** Contenu supplémentaire dans la fiche. */
  extra?: React.ReactNode;
  /** Lien affiché en bas de la fiche. */
  link?: { href: string; label: string };
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  /** Contenu du noyau central. */
  center?: React.ReactNode;
  className?: string;
  /** Hauteur de la zone (classe Tailwind). */
  heightClassName?: string;
  labels?: {
    related?: string;
    energy?: string;
    status?: Record<NonNullable<TimelineItem["status"]>, string>;
  };
}

const defaultLabels = {
  related: "Connected Nodes",
  energy: "Energy Level",
  status: { completed: "COMPLETE", "in-progress": "IN PROGRESS", pending: "PENDING" },
};

export default function RadialOrbitalTimeline({
  timelineData,
  center,
  className,
  heightClassName = "h-[560px]",
  labels,
}: RadialOrbitalTimelineProps) {
  const l = { ...defaultLabels, ...labels, status: { ...defaultLabels.status, ...labels?.status } };
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [radius, setRadius] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const activeNodeId = expandedId;

  const closeAll = useCallback(() => {
    setExpandedId(null);
    setAutoRotate(true);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) closeAll();
  };

  const getRelatedItems = (itemId: number): number[] =>
    timelineData.find((item) => item.id === itemId)?.relatedIds ?? [];

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id: number) => {
    if (expandedId === id) {
      closeAll();
      return;
    }
    setExpandedId(id);
    setAutoRotate(false);
    centerViewOnNode(id);
  };

  // Rayon adapté à la largeur disponible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setRadius(Math.max(95, Math.min(200, w / 2 - (w < 480 ? 85 : 70))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Échap ferme la fiche ouverte
  useEffect(() => {
    if (expandedId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expandedId, closeAll]);

  // Rotation fluide : une image par rafraîchissement d'écran, vitesse fondée sur le temps écoulé
  // (6°/s, comme avant), au lieu d'un minuteur toutes les 50 ms combiné à une transition CSS
  // qui « rattrapait » la position en permanence et donnait un mouvement saccadé.
  useEffect(() => {
    if (!autoRotate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let precedent = performance.now();
    const tourner = (maintenant: number) => {
      const ecoule = Math.min(maintenant - precedent, 100);
      precedent = maintenant;
      setRotationAngle((prev) => (prev + ecoule * 0.006) % 360);
      frame = requestAnimationFrame(tourner);
    };
    frame = requestAnimationFrame(tourner);
    return () => cancelAnimationFrame(frame);
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.55, Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number) => activeNodeId !== null && getRelatedItems(activeNodeId).includes(itemId);

  const getStatusStyles = (status: NonNullable<TimelineItem["status"]>): string => {
    switch (status) {
      case "completed":
        return "text-primary-foreground bg-primary border-primary";
      case "in-progress":
        return "text-foreground bg-background border-foreground";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div
      className={cn("relative flex w-full flex-col items-center justify-center", heightClassName, className)}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="absolute inset-0 flex items-center justify-center" ref={orbitRef} style={{ perspective: "1000px" }}>
        {/* Noyau central */}
        <div className="absolute z-10 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <div aria-hidden className="absolute size-20 animate-ping rounded-full border border-primary/30 opacity-70 [animation-duration:2.5s]" />
          <div
            aria-hidden
            className="absolute size-24 animate-ping rounded-full border border-primary/20 opacity-50 [animation-duration:2.5s]"
            style={{ animationDelay: "0.6s" }}
          />
          {center ?? <div className="size-8 rounded-full bg-primary-foreground/80" />}
        </div>

        {/* Orbite */}
        <div
          aria-hidden
          className="absolute rounded-full border border-dashed border-foreground/25"
          style={{ width: radius * 2, height: radius * 2 }}
        />

        <ul className="contents">
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedId === item.id;
            const isRelated = isRelatedToActive(item.id);
            const Icon = item.icon;
            const halo = (item.energy ?? 40) * 0.5 + 40;

            return (
              <li
                key={item.id}
                // Transition seulement quand on recentre sur une mission ouverte (pas pendant la rotation).
                className={cn("absolute will-change-transform", !autoRotate && "transition-[transform,opacity] duration-700")}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
              >
                <div
                  aria-hidden
                  className={cn("absolute rounded-full", isRelated && "animate-pulse")}
                  style={{
                    background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 70%, transparent) 0%, transparent 70%)",
                    width: halo,
                    height: halo,
                    left: -(halo - 40) / 2,
                    top: -(halo - 40) / 2,
                  }}
                />

                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`orbite-fiche-${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                  className="group relative flex flex-col items-center"
                >
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isExpanded
                        ? "scale-150 border-foreground bg-accent text-accent-foreground shadow-lg"
                        : isRelated
                          ? "animate-pulse border-foreground bg-accent/70 text-foreground"
                          : cn("border-foreground bg-card text-foreground group-hover:bg-accent", item.nodeClassName)
                    )}
                  >
                    <Icon size={16} aria-hidden />
                  </span>
                  <span
                    className={cn(
                      "absolute top-12 whitespace-nowrap rounded-full bg-background/80 px-2 py-0.5 text-[0.7rem] font-bold sm:text-[0.8rem] tracking-wide transition-all duration-300",
                      isExpanded ? "scale-110 text-foreground" : "text-foreground/80"
                    )}
                  >
                    {item.title}
                  </span>
                </button>

                {isExpanded && (
                  <Card
                    id={`orbite-fiche-${item.id}`}
                    className="absolute top-20 left-1/2 w-64 -translate-x-1/2 overflow-visible shadow-xl"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <div aria-hidden className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-foreground/50" />
                    <CardHeader className="pb-2">
                      {(item.status || item.date) && (
                        <div className="flex items-center justify-between gap-2">
                          {item.status && (
                            <Badge className={cn("px-2 text-xs", getStatusStyles(item.status))}>{l.status[item.status]}</Badge>
                          )}
                          {item.date && <span className="font-mono text-xs text-muted-foreground">{item.date}</span>}
                        </div>
                      )}
                      <CardTitle className="mt-1 text-sm">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <p className="text-sm leading-snug text-foreground/85">{item.content}</p>
                      {item.extra && <div className="mt-3">{item.extra}</div>}

                      {item.energy !== undefined && (
                        <div className="mt-4 border-t pt-3">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="flex items-center">
                              <Zap size={10} className="mr-1" aria-hidden />
                              {l.energy}
                            </span>
                            <span className="font-mono">{item.energy}%</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${item.energy}%` }} />
                          </div>
                        </div>
                      )}

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 border-t pt-3">
                          <div className="mb-2 flex items-center">
                            <Link size={10} className="mr-1" aria-hidden />
                            <h4 className="text-xs font-medium tracking-wider uppercase">{l.related}</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 rounded-full px-2 py-0 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1" aria-hidden />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {item.link && (
                        <a
                          href={item.link.href}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground underline underline-offset-4"
                        >
                          {item.link.label}
                          <ArrowRight size={12} aria-hidden />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
