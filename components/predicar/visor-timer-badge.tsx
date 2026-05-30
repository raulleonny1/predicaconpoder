"use client";

import { useEffect, useState } from "react";
import { loadTimer } from "@/lib/sermon/storage";
import type { TimerState } from "@/lib/sermon/types";
import { cn } from "@/lib/utils";

function getElapsed(timer: TimerState): number {
  if (!timer.running || !timer.startedAt) return timer.elapsedMs;
  return timer.elapsedMs + (Date.now() - timer.startedAt);
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VisorTimerBadge() {
  const [elapsed, setElapsed] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const timer = loadTimer();
      setElapsed(getElapsed(timer));
      setTargetMinutes(timer.targetMinutes);
      setRunning(timer.running);
    };

    refresh();
    const id = setInterval(refresh, 1000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "pcp:timer") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const targetMs = targetMinutes ? targetMinutes * 60 * 1000 : null;
  const overTarget = targetMs ? elapsed > targetMs : false;

  return (
    <div
      className={cn(
        "fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-50 rounded-full px-4 py-2 font-heading text-sm font-bold tabular-nums backdrop-blur-md",
        running ? "bg-accent/80 text-white" : "bg-black/55 text-white/80",
        overTarget && "bg-amber-500/90 text-white",
      )}
      title="Cronómetro (contrólalo en la consola de predicar)"
    >
      {formatMs(elapsed)}
      {targetMinutes ? <span className="ml-2 text-xs font-semibold opacity-80">/ {targetMinutes}m</span> : null}
    </div>
  );
}
