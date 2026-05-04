"use client";

import { useLanguage } from "@/lib/language-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2, Play, RotateCcw, Zap, Trophy } from "lucide-react";

interface FallingCode {
  id: number;
  x: number;
  y: number;
  code: string;
  speed: number;
}

const CODE_SNIPPETS = [
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
];

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
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (spawnerRef.current) {
      clearInterval(spawnerRef.current);
      spawnerRef.current = null;
    }
  }, []);

  const endGame = useCallback((finalScore: number) => {
    cleanup();
    setIsPlaying(false);
    setGameOver(true);
    setHighScore((prev) => Math.max(prev, finalScore));
  }, [cleanup]);

  const startGame = useCallback(() => {
    cleanup();
    setIsPlaying(true);
    setScore(0);
    setGameOver(false);
    setFallingCodes([]);
    setTimeLeft(30);
    setCombo(0);
  }, [cleanup]);

  const catchCode = useCallback((id: number) => {
    setFallingCodes((prev) => prev.filter((code) => code.id !== id));
    setCombo((prev) => {
      const newCombo = prev + 1;
      const comboBonus = Math.floor(newCombo / 3) * 5;
      setScore((s) => s + 10 + comboBonus);
      return newCombo;
    });
  }, []);

  // Game loop effect
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let currentScore = score;

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setScore((s) => {
            currentScore = s;
            return s;
          });
          setTimeout(() => endGame(currentScore), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawner
    spawnerRef.current = setInterval(() => {
      const newCode: FallingCode = {
        id: Date.now() + Math.random(),
        x: Math.random() * 75 + 10,
        y: 0,
        code: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
        speed: Math.random() * 0.8 + 0.4,
      };
      setFallingCodes((prev) => [...prev.slice(-15), newCode]);
    }, 900);

    // Animation loop using setInterval for consistent timing
    const gameLoop = () => {
      setFallingCodes((prev) => {
        const updated = prev.map((code) => ({
          ...code,
          y: code.y + code.speed * 1.2,
        }));

        const remaining = updated.filter((code) => {
          if (code.y > 95) {
            setCombo(0);
            return false;
          }
          return true;
        });

        return remaining;
      });
    };

    const animationInterval = setInterval(gameLoop, 50);
    gameLoopRef.current = animationInterval as unknown as number;

    return cleanup;
  }, [isPlaying, gameOver, cleanup, endGame, score]);

  // Update currentScore tracker
  useEffect(() => {
    // This effect just tracks the score for the endGame callback
  }, [score]);

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary animate-float" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-primary" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)' }}>
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
          className="relative glass rounded-2xl border border-accent/30 overflow-hidden select-none"
          style={{ height: "400px" }}
        >
          {/* Scanlines effect */}
          <div className="scanlines absolute inset-0 pointer-events-none z-10" />

          {/* Score display */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
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
              <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-400' : 'text-accent'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Falling codes */}
          {isPlaying && fallingCodes.map((code) => (
            <button
              key={code.id}
              onClick={() => catchCode(code.id)}
              className="absolute px-3 py-1.5 glass rounded-lg border border-primary/50 
                         font-mono text-sm text-primary cursor-pointer
                         hover:scale-125 hover:bg-primary hover:text-primary-foreground
                         transition-all duration-100 active:scale-90 z-20"
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
                  <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-float" />
                  <h3 className="text-2xl font-mono font-bold text-accent mb-2 animate-glitch">
                    {t("gameOver")}
                  </h3>
                  <p className="font-mono text-muted-foreground mb-2">
                    {t("score")}: <span className="text-primary">{score}</span>
                  </p>
                  <p className="font-mono text-sm text-yellow-400 mb-6">
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
                  <Gamepad2 className="w-16 h-16 text-primary mb-4 animate-float" />
                  <h3 className="text-xl font-mono font-bold text-foreground mb-2">
                    Catch The Code
                  </h3>
                  <p className="font-mono text-muted-foreground mb-6 text-center px-4 max-w-sm">
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
