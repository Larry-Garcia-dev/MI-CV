"use client";

import { useLanguage } from "@/lib/language-context";
import { useState, useEffect } from "react";
import { User, Briefcase, Code, Mail, Gamepad2, Home } from "lucide-react";

export function FloatingNav() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  const navItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "profile", icon: User, label: t("about") },
    { id: "experience", icon: Briefcase, label: t("experience") },
    { id: "skills", icon: Code, label: t("skills") },
    { id: "game", icon: Gamepad2, label: t("miniGame") },
    { id: "contact", icon: Mail, label: t("contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);

      // Determine active section
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      for (const section of sections.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`
        fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500
        ${isVisible ? "bottom-6 opacity-100" : "-bottom-20 opacity-0"}
      `}
    >
      <div className="glass rounded-full px-4 py-2 border border-primary/30 flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                relative p-3 rounded-full transition-all duration-300 group
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />

              {/* Tooltip */}
              <span
                className={`
                  absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1
                  glass rounded text-xs font-mono whitespace-nowrap
                  transition-all duration-200
                  ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                  }
                `}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
