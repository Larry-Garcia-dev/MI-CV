"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const { t } = useLanguage();
  const [displayedName, setDisplayedName] = useState("");
  const [displayedRole, setDisplayedRole] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState(0);
  const [imageHover, setImageHover] = useState(false);

  const name = t("name");
  const role = t("role");

  useEffect(() => {
    setDisplayedName("");
    setDisplayedRole("");
    setPhase(0);
  }, [name, role]);

  useEffect(() => {
    if (phase === 0) {
      const timeout = setTimeout(() => {
        if (displayedName.length < name.length) {
          setDisplayedName(name.slice(0, displayedName.length + 1));
        } else {
          setPhase(1);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    if (phase === 1) {
      const timeout = setTimeout(() => {
        if (displayedRole.length < role.length) {
          setDisplayedRole(role.slice(0, displayedRole.length + 1));
        } else {
          setPhase(2);
        }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [displayedName, displayedRole, name, role, phase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-1000" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Profile photo */}
        <div 
          className="relative mx-auto mb-8 w-40 h-40 md:w-52 md:h-52"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        >
          {/* Rotating border */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              imageHover ? 'animate-spin-slow' : ''
            }`}
            style={{
              background: 'conic-gradient(from 0deg, var(--neon-cyan), var(--neon-pink), var(--neon-blue), var(--neon-cyan))',
              padding: '3px',
            }}
          >
            <div className="w-full h-full rounded-full bg-background" />
          </div>
          
          {/* Image container */}
          <div className={`absolute inset-1 rounded-full overflow-hidden transition-all duration-500 ${
            imageHover ? 'scale-105' : 'scale-100'
          }`}>
            <Image
              src="/images/profile.jpg"
              alt="Larry Garcia - Software Developer"
              fill
              className={`object-cover transition-all duration-500 ${
                imageHover ? 'scale-110 brightness-110' : 'scale-100'
              }`}
              priority
            />
            
            {/* Holographic overlay on hover */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              imageHover ? 'opacity-30' : 'opacity-0'
            }`} style={{
              background: 'linear-gradient(45deg, transparent 40%, var(--neon-cyan) 45%, var(--neon-pink) 55%, transparent 60%)',
              backgroundSize: '200% 200%',
              animation: imageHover ? 'border-flow 2s ease infinite' : 'none'
            }} />
          </div>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${
            imageHover ? 'opacity-60' : 'opacity-30'
          }`} style={{
            background: 'radial-gradient(circle, var(--neon-cyan), transparent 70%)'
          }} />
        </div>

        {/* Glitch effect name */}
        <div className="relative mb-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold tracking-wider text-primary neon-text">
            {displayedName}
            <span
              className={`${
                showCursor && phase < 2 ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            >
              _
            </span>
          </h1>
          {/* Glitch copies */}
          <h1 className="absolute top-0 left-0 w-full text-4xl md:text-6xl lg:text-7xl font-mono font-bold tracking-wider text-accent/50 animate-glitch -z-10">
            {displayedName}
          </h1>
        </div>

        {/* Role with typing effect */}
        <div className="relative">
          <h2 className="text-lg md:text-xl lg:text-2xl font-mono text-foreground/80 mb-2">
            {">"} {displayedRole}
            <span
              className={`${
                showCursor && phase >= 1 && phase < 2
                  ? "opacity-100"
                  : "opacity-0"
              } transition-opacity text-primary`}
            >
              |
            </span>
          </h2>
          <p className="text-base md:text-lg text-accent font-mono animate-text-glow">
            {t("subtitle")}
          </p>
        </div>

        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {t("systemReady")}
          </span>
        </div>

        {/* Terminal-style welcome */}
        <div className="mt-10 glass rounded-lg p-4 max-w-md mx-auto border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <p className="font-mono text-sm text-left text-muted-foreground">
            <span className="text-primary">$</span> echo{" "}
            {`"${t("welcomeMessage")}"`}
            <br />
            <span className="text-accent">{t("welcomeMessage")}</span>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
      >
        <span className="font-mono text-xs uppercase tracking-widest">
          {t("scrollToExplore")}
        </span>
        <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-primary" />
      </button>

      {/* Scanlines */}
      <div className="scanlines absolute inset-0 pointer-events-none" />
    </section>
  );
}
