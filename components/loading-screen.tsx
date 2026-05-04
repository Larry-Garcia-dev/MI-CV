"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";

export function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [phase, setPhase] = useState(0);

  const loadingPhases = [
    { text: "Initializing neural network...", target: 20 },
    { text: "Loading AI modules...", target: 40 },
    { text: "Connecting to database...", target: 60 },
    { text: "Rendering interface...", target: 80 },
    { text: "System ready!", target: 100 },
  ];

  useEffect(() => {
    const currentPhase = loadingPhases[phase];
    if (!currentPhase) return;

    setStatusText(currentPhase.text);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= currentPhase.target) {
          clearInterval(interval);
          if (phase < loadingPhases.length - 1) {
            setTimeout(() => setPhase((p) => p + 1), 300);
          } else {
            setTimeout(onComplete, 500);
          }
          return currentPhase.target;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse" />

      {/* Logo/Name */}
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-6xl font-mono font-bold text-primary neon-text animate-text-glow">
          LARRY GARCIA
        </h1>
        <div className="absolute -bottom-2 left-0 right-0 h-1 animate-border-flow rounded-full" />
      </div>

      {/* Progress bar container */}
      <div className="w-80 md:w-96 relative">
        {/* Progress bar background */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          {/* Progress bar fill */}
          <div
            className="h-full rounded-full transition-all duration-100 relative"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, var(--primary), var(--accent))`,
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[border-flow_1s_linear_infinite]" />
          </div>
        </div>

        {/* Progress percentage */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-mono text-sm text-muted-foreground">
            {statusText}
          </span>
          <span className="font-mono text-sm text-primary">{progress}%</span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 font-mono text-xs text-muted-foreground/50">
        <span className="animate-pulse">{">"}</span> v1.0.0
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-xs text-muted-foreground/50">
        <span className="animate-pulse">{"<"}</span>/LOADING
        <span className="animate-pulse">{">"}</span>
      </div>

      {/* Scanlines */}
      <div className="scanlines absolute inset-0 pointer-events-none opacity-50" />
    </div>
  );
}
