"use client";
// Adapté pour Biotrace : date cible réelle (`target`) au lieu d'une durée fixe,
// textes et libellés en props, calcul uniquement côté navigateur (pas d'écart d'hydratation),
// messages « Jour J » / « terminé », formulaire optionnel (affiché seulement s'il est relié
// à un vrai service via `notify.action`), sinon zone d'actions libres.
// Icône : équivalent lucide-react de RiRocket2Line (pas de dépendance @remixicon/react).

import { Fragment, useEffect, useState } from "react";
import { Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(diffMs: number): TimeLeft {
  const diff = Math.max(0, diffMs);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

const defaultLabels = { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" };
const keys = ["days", "hours", "minutes", "seconds"] as const;

// Démo d'origine : J-14 06:42:18 à partir de maintenant.
const DEMO_DURATION_MS = 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 42 * 60 * 1000 + 18 * 1000;

export interface ComingSoonBlockProps {
  /** Date cible (ISO avec fuseau, ex. "2027-02-01T00:00:00+01:00"). Sans cible : démo J-14. */
  target?: string;
  /** Fin de l'événement : après cette date, `endedMessage` s'affiche. */
  end?: string;
  badge?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  labels?: Partial<typeof defaultLabels>;
  /** Message affiché quand le compte à rebours atteint zéro (avant `end`). */
  liveMessage?: React.ReactNode;
  endedMessage?: React.ReactNode;
  /** Phrase lue par les lecteurs d'écran, ex. (j) => `Plus que ${j} jours`. */
  srSummary?: (t: TimeLeft) => string;
  /** Formulaire d'inscription : uniquement s'il est relié à un vrai service. */
  notify?: { action: string; placeholder?: string; label?: string; submitLabel?: string };
  /** Actions affichées sous le compte à rebours (liens, boutons…). */
  actions?: React.ReactNode;
  className?: string;
  tileClassName?: string;
  headingLevel?: "h1" | "h2";
}

export default function ComingSoonBlock({
  target,
  end,
  badge = "Coming Soon",
  title = "The countdown to our biggest launch yet",
  description = "We go live the moment the timer hits zero. Drop your email and we will make sure you are first through the door.",
  labels,
  liveMessage = "It's happening now!",
  endedMessage = "This event has ended.",
  srSummary,
  notify,
  actions,
  className,
  tileClassName,
  headingLevel = "h1",
}: ComingSoonBlockProps) {
  // null tant que le navigateur n'a pas calculé l'heure (le serveur affiche « -- »)
  const [now, setNow] = useState<number | null>(null);
  const [demoDeadline, setDemoDeadline] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(() => {
      if (!target) setDemoDeadline(Date.now() + DEMO_DURATION_MS);
      tick();
    }, 0);
    const interval = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [target]);

  const deadline = target ? new Date(target).getTime() : demoDeadline;
  const timeLeft = now !== null && deadline !== null ? getTimeLeft(deadline - now) : null;
  const reached = now !== null && deadline !== null && now >= deadline;
  const ended = now !== null && !!end && now >= new Date(end).getTime();
  const tileLabels = { ...defaultLabels, ...labels };
  const Heading = headingLevel;

  return (
    <section
      className={cn(
        "flex min-h-svh w-full flex-col items-center justify-center gap-8 bg-background px-6 py-12 text-center text-foreground",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="flex items-center gap-2 border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          <Rocket className="size-3.5" aria-hidden="true" />
          {badge}
        </span>
        <Heading className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</Heading>
        {description && <div className="max-w-md text-sm text-muted-foreground sm:text-base">{description}</div>}
      </div>

      {ended || reached ? (
        <p className="text-2xl font-bold sm:text-3xl" role="status">
          {ended ? endedMessage : liveMessage}
        </p>
      ) : (
        <div role="timer" aria-live="off" className="flex flex-col items-center gap-2">
          {timeLeft && srSummary && <p className="sr-only">{srSummary(timeLeft)}</p>}
          <div aria-hidden={!!srSummary} className="flex items-center justify-center gap-2 sm:gap-3">
            {keys.map((key, index) => (
              <Fragment key={key}>
                <div className={cn("flex w-16 flex-col overflow-hidden border border-border sm:w-20", tileClassName)}>
                  <span className="bg-card py-3 font-mono text-3xl font-bold tabular-nums sm:text-4xl">
                    {timeLeft ? pad(timeLeft[key]) : "--"}
                  </span>
                  <span className="border-t border-border bg-muted/40 py-1.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    {tileLabels[key]}
                  </span>
                </div>
                {index < keys.length - 1 && (
                  <span aria-hidden="true" className="font-mono text-2xl font-bold text-muted-foreground/30 sm:text-3xl">
                    :
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {notify && (
        <form action={notify.action} method="post" className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={notify.placeholder ?? "you@example.com"}
            aria-label={notify.label ?? "Email address"}
          />
          <Button type="submit" className="shrink-0">
            {notify.submitLabel ?? "Notify me"}
          </Button>
        </form>
      )}

      {actions && <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </section>
  );
}
