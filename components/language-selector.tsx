"use client";

import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";
import { useState } from "react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed top-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
        glass rounded-full p-2 flex items-center gap-2 
        border border-primary/30 hover:border-primary/60 
        transition-all duration-300
        ${isHovered ? "px-4" : ""}
      `}
      >
        <Globe className="w-5 h-5 text-primary animate-pulse" />

        <div
          className={`flex gap-2 overflow-hidden transition-all duration-300 ${
            isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          <button
            onClick={() => setLanguage("es")}
            className={`
              px-3 py-1 rounded-full font-mono text-xs transition-all duration-200
              ${
                language === "es"
                  ? "bg-primary text-primary-foreground neon-text"
                  : "text-muted-foreground hover:text-primary"
              }
            `}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`
              px-3 py-1 rounded-full font-mono text-xs transition-all duration-200
              ${
                language === "en"
                  ? "bg-primary text-primary-foreground neon-text"
                  : "text-muted-foreground hover:text-primary"
              }
            `}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}
