"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  originalX: number;
  originalY: number;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isMoving: false });
  const animationRef = useRef<number>(0);
  const lastMouseMove = useRef<number>(0);

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const colors = ["#00ffff", "#ff00ff", "#00ff88", "#4488ff"];
    particlesRef.current = Array.from({ length: 100 }, () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return {
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true };
      lastMouseMove.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY, 
          isMoving: true 
        };
        lastMouseMove.current = Date.now();
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, isMoving: false };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      // Check if mouse stopped moving
      if (Date.now() - lastMouseMove.current > 100) {
        mouseRef.current.isMoving = false;
      }

      ctx.fillStyle = "rgba(10, 10, 30, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const interactionRadius = 200;
      const repelStrength = 0.08;
      const attractStrength = 0.002;

      particlesRef.current.forEach((particle, i) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouseRef.current.isMoving && dist < interactionRadius) {
          // Repel particles from cursor (creates wave effect)
          const force = (interactionRadius - dist) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * repelStrength;
          particle.vy -= Math.sin(angle) * force * repelStrength;
        } else if (!mouseRef.current.isMoving && dist < interactionRadius * 1.5) {
          // Gentle attraction when mouse is still
          particle.vx += dx * attractStrength * 0.01;
          particle.vy += dy * attractStrength * 0.01;
        }

        // Add some drift back to original position
        particle.vx += (particle.originalX - particle.x) * 0.0003;
        particle.vy += (particle.originalY - particle.y) * 0.0003;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Calculate glow intensity based on mouse proximity
        const glowIntensity = dist < interactionRadius 
          ? 1 + (1 - dist / interactionRadius) * 2 
          : 1;

        // Draw outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4 * glowIntensity, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4 * glowIntensity
        );
        gradient.addColorStop(0, particle.color + "30");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * glowIntensity, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Connect nearby particles with lines
        particlesRef.current.slice(i + 1).forEach((other) => {
          const pdx = particle.x - other.x;
          const pdy = particle.y - other.y;
          const distance = Math.sqrt(pdx * pdx + pdy * pdy);

          if (distance < 150) {
            // Calculate if line is near cursor for extra glow
            const midX = (particle.x + other.x) / 2;
            const midY = (particle.y + other.y) / 2;
            const mouseDistToLine = Math.sqrt(
              (midX - mouseX) ** 2 + (midY - mouseY) ** 2
            );
            const lineGlow = mouseDistToLine < 100 ? 0.6 : 0.2;

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            const alpha = Math.floor((1 - distance / 150) * 255 * lineGlow)
              .toString(16)
              .padStart(2, "0");
            ctx.strokeStyle = `${particle.color}${alpha}`;
            ctx.lineWidth = mouseDistToLine < 100 ? 1 : 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw cursor trail effect
      if (mouseRef.current.isMoving && mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, 80
        );
        gradient.addColorStop(0, "rgba(0, 255, 255, 0.15)");
        gradient.addColorStop(0.5, "rgba(255, 0, 255, 0.05)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
