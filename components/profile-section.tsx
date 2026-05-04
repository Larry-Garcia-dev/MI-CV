"use client";

import { useLanguage } from "@/lib/language-context";
import { useState, useEffect, useRef } from "react";
import { User, Terminal } from "lucide-react";

export function ProfileSection() {
  const { t } = useLanguage();
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const profileText = t("profileText");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    setDisplayedText("");

    let index = 0;
    const interval = setInterval(() => {
      if (index < profileText.length) {
        setDisplayedText(profileText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [isVisible, profileText]);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <User className="w-8 h-8 text-primary animate-float" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-primary neon-text">
              {t("profile")}
            </h2>
          </div>
          <div className="w-32 h-1 mx-auto animate-border-flow rounded-full" />
        </div>

        {/* Terminal-style profile */}
        <div className="glass rounded-2xl border border-primary/30 overflow-hidden hover-lift">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:scale-125 transition-transform cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-125 transition-transform cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:scale-125 transition-transform cursor-pointer" />
            <div className="flex-1 text-center">
              <span className="font-mono text-xs text-muted-foreground">
                profile.tsx — Larry Garcia
              </span>
            </div>
            <Terminal className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Terminal content */}
          <div className="p-6 md:p-8">
            {/* Command line */}
            <div className="flex items-start gap-2 mb-4">
              <span className="text-accent font-mono">$</span>
              <span className="font-mono text-muted-foreground">
                cat profile.md
              </span>
            </div>

            {/* Profile text with typing effect */}
            <div className="pl-4 border-l-2 border-primary/30">
              <p className="font-mono text-sm md:text-base text-foreground/90 leading-relaxed">
                {displayedText}
                <span className="animate-pulse text-primary">|</span>
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Years Exp", value: "3+", icon: "📅" },
                { label: "Projects", value: "50+", icon: "💻" },
                { label: "AI Models", value: "10+", icon: "🤖" },
                { label: "Automations", value: "100+", icon: "⚡" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass rounded-lg p-4 text-center hover:border-primary/50 border border-transparent transition-all hover-lift group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl mb-2 group-hover:scale-125 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="font-mono text-2xl font-bold text-primary group-hover:neon-text transition-all">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* New line prompt */}
            <div className="mt-8 flex items-center gap-2">
              <span className="text-accent font-mono">$</span>
              <span className="text-muted-foreground font-mono terminal-cursor">
                _
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
