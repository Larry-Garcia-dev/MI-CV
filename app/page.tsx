"use client";

import { useState } from "react";
import { LanguageProvider } from "@/lib/language-context";
import { ParticlesBackground } from "@/components/particles-background";
import { HeroSection } from "@/components/hero-section";
import { LanguageSelector } from "@/components/language-selector";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/experience-section";
import { MiniGame } from "@/components/mini-game";
import { ContactSection } from "@/components/contact-section";
import { ProfileSection } from "@/components/profile-section";
import { FloatingNav } from "@/components/floating-nav";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LanguageProvider>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <main
        className={`min-h-screen bg-background relative transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Animated particles background */}
        <ParticlesBackground />

        {/* Language selector */}
        <LanguageSelector />

        {/* Floating navigation */}
        <FloatingNav />

        {/* Hero Section */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* Profile Section */}
        <div id="profile">
          <ProfileSection />
        </div>

        {/* Experience Section */}
        <div id="experience">
          <ExperienceSection />
        </div>

        {/* Skills Section */}
        <div id="skills">
          <SkillsSection />
        </div>

        {/* Mini Game Section */}
        <div id="game">
          <MiniGame />
        </div>

        {/* Contact Section */}
        <div id="contact">
          <ContactSection />
        </div>

        {/* Footer */}
        <footer className="py-8 text-center border-t border-border">
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">{"<"}</span>
            Built with React & Next.js
            <span className="text-primary">{" />"}</span>
          </p>
          <p className="font-mono text-xs text-muted-foreground/50 mt-2">
            © 2025 Larry Garcia - All rights reserved
          </p>
        </footer>
      </main>
    </LanguageProvider>
  );
}
