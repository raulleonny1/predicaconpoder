"use client";

import { useSermon } from "@/lib/sermon/sermon-context";
import { cn } from "@/lib/utils";

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const TARGETS = [30, 45, 60, 90] as const;

export function PresenterTimer() {
  const {
    timer,
    timerDisplayMs,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerTarget,
  } = useSermon();

  const targetMs = timer.targetMinutes ? timer.targetMinutes * 60 * 1000 : null;
  const progress = targetMs ? Math.min(1, timerDisplayMs / targetMs) : null;
  const overTarget = targetMs ? timerDisplayMs > targetMs : false;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">
          Cronómetro
        </span>
        <select
          value={timer.targetMinutes ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setTimerTarget(v ? parseInt(v, 10) : null);
          }}
          className="rounded-lg border border-white/15 bg-void px-2 py-1 text-xs text-white/80 outline-none"
          aria-label="Meta de tiempo"
        >
          <option value="">Sin meta</option>
          {TARGETS.map((m) => (
            <option key={m} value={m}>
              Meta {m} min
            </option>
          ))}
        </select>
      </div>

      <p
        className={cn(
          "mt-2 font-heading text-3xl font-bold tabular-nums tracking-tight",
          overTarget ? "text-amber-400" : "text-white",
        )}
      >
        {formatMs(timerDisplayMs)}
      </p>

      {progress !== null ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              overTarget ? "bg-amber-400" : "bg-accent-glow",
            )}
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      ) : null}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={timer.running ? pauseTimer : startTimer}
          className="flex-1 rounded-lg bg-accent py-2 text-xs font-bold text-white transition hover:brightness-110"
        >
          {timer.running ? "Pausar" : "Iniciar"}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
