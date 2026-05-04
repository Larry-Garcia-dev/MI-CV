"use client";

import { useLanguage } from "@/lib/language-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2, Play, RotateCcw, Zap } from "lucide-react";

interface FallingCode {
  id: number;
  x: number;
  y: number;
  code: string;
  speed: number;
}

export function MiniGame() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [fallingCodes, setFallingCodes] = useState<FallingCode[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const codeSnippets = [
    "const",
    "function",
    "return",
    "async",
    "await",
    "import",
    "export",
    "class",
    "interface",
    "type",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "try",
    "catch",
    "throw",
    "new",
    "{}",
    "[]",
    "=>",
    "()",
    "===",
    "!==",
    "&&",
    "||",
    "++",
    "--",
  ];

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setGameOver(false);
    setFallingCodes([]);
    setTimeLeft(30);
    setCombo(0);
  }, []);

  const catchCode = useCallback(
    (id: number) => {
      setFallingCodes((prev) => prev.filter((code) => code.id !== id));
      const comboBonus = Math.floor(combo / 3);
      setScore((prev) => prev + 10 + comboBonus * 5);
      setCombo((prev) => prev + 1);
    },
    [combo]
  );

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          setHighScore((high) => Math.max(high, score));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn new codes
    const spawner = setInterval(() => {
      const newCode: FallingCode = {
        id: Date.now() + Math.random(),
        x: Math.random() * 80 + 10,
        y: 0,
        code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: Math.random() * 2 + 1,
      };
      setFallingCodes((prev) => [...prev, newCode]);
    }, 800);

    // Move codes down
    const gameLoop = () => {
      setFallingCodes((prev) => {
        const updated = prev
          .map((code) => ({
            ...code,
            y: code.y + code.speed,
          }))
          .filter((code) => {
            if (code.y > 100) {
              setCombo(0); // Reset combo when code is missed
              return false;
            }
            return true;
          });
        return updated;
      });
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameOver, score, codeSnippets]);

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-accent animate-float" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-accent neon-text">
              {t("miniGame")}
            </h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            {t("catchTheCode")}
          </p>
        </div>

        {/* Game area */}
        <div
          ref={gameAreaRef}
          className="relative glass rounded-2xl border border-accent/30 overflow-hidden"
          style={{ height: "400px" }}
        >
          {/* Scanlines effect */}
          <div className="scanlines absolute inset-0 pointer-events-none z-10" />

          {/* Score display */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
            <div className="glass px-4 py-2 rounded-lg">
              <span className="font-mono text-sm text-muted-foreground">
                {t("score")}:{" "}
              </span>
              <span className="font-mono text-lg text-primary neon-text">
                {score}
              </span>
            </div>
            <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
              <Zap
                className={`w-4 h-4 ${combo > 0 ? "text-yellow-400" : "text-muted-foreground"}`}
              />
              <span className="font-mono text-sm text-yellow-400">
                x{combo}
              </span>
            </div>
            <div className="glass px-4 py-2 rounded-lg">
              <span className="font-mono text-lg text-accent">
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Falling codes */}
          {fallingCodes.map((code) => (
            <button
              key={code.id}
              onClick={() => catchCode(code.id)}
              className="absolute px-3 py-1 glass rounded-lg border border-primary/50 
                         font-mono text-sm text-primary cursor-pointer
                         hover:scale-125 hover:bg-primary hover:text-primary-foreground
                         transition-all duration-100 active:scale-90"
              style={{
                left: `${code.x}%`,
                top: `${code.y}%`,
                transform: "translateX(-50%)",
              }}
            >
              {code.code}
            </button>
          ))}

          {/* Start/Game Over overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-30">
              {gameOver ? (
                <>
                  <h3 className="text-2xl font-mono font-bold text-accent mb-2 animate-glitch">
                    {t("gameOver")}
                  </h3>
                  <p className="font-mono text-muted-foreground mb-2">
                    {t("score")}: {score}
                  </p>
                  <p className="font-mono text-sm text-primary mb-6">
                    High Score: {highScore}
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground 
                               rounded-lg font-mono hover:scale-105 transition-transform
                               hover-lift animate-glow-pulse"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t("playAgain")}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4 animate-float">🎮</div>
                  <p className="font-mono text-muted-foreground mb-6 text-center px-4">
                    {t("catchTheCode")}
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground 
                               rounded-lg font-mono hover:scale-105 transition-transform
                               hover-lift animate-glow-pulse"
                  >
                    <Play className="w-5 h-5" />
                    {t("startGame")}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
