"use client";

import { useLanguage } from "@/lib/language-context";
import { useState } from "react";
import { Briefcase, ChevronRight, Building2 } from "lucide-react";

interface ExperienceCardProps {
  company: string;
  role: string;
  date: string;
  responsibilities: string[];
  index: number;
}

function ExperienceCard({
  company,
  role,
  date,
  responsibilities,
  index,
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`
        relative pl-8 pb-12 
        ${index !== 2 ? "border-l-2 border-primary/30" : ""}
      `}
    >
      {/* Timeline dot */}
      <div
        className={`
          absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full 
          border-2 border-primary transition-all duration-300
          ${isHovered ? "bg-primary scale-125 animate-glow-pulse" : "bg-background"}
        `}
      />

      {/* Connection line animation */}
      {index !== 2 && (
        <div
          className={`
            absolute left-0 top-4 w-0.5 bg-primary/50 -translate-x-1/2
            transition-all duration-500 ease-out
            ${isHovered ? "h-full" : "h-0"}
          `}
        />
      )}

      {/* Card */}
      <div
        className={`
          glass rounded-xl p-6 ml-4 border border-border
          hover:border-primary/50 transition-all duration-300
          cursor-pointer hover-lift relative overflow-hidden
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Holographic effect */}
        <div
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            ${isHovered ? "opacity-100" : ""}
          `}
          style={{
            background: `linear-gradient(135deg, transparent 40%, rgba(0, 255, 255, 0.05) 50%, transparent 60%)`,
            backgroundSize: "200% 200%",
            animation: isHovered ? "border-flow 2s linear infinite" : "none",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`
                  p-2 rounded-lg bg-primary/10 text-primary
                  transition-all duration-300
                  ${isHovered ? "rotate-12 scale-110" : ""}
                `}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                  {company}
                </h3>
                <p className="text-sm font-mono text-primary">{role}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              {date}
            </span>
          </div>

          {/* Responsibilities */}
          <div
            className={`
              overflow-hidden transition-all duration-500
              ${isExpanded ? "max-h-96" : "max-h-20"}
            `}
          >
            <ul className="space-y-2">
              {responsibilities.map((resp, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <ChevronRight
                    className={`w-4 h-4 mt-0.5 text-accent flex-shrink-0 transition-transform duration-300 ${
                      isHovered ? "translate-x-1" : ""
                    }`}
                  />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expand indicator */}
          {responsibilities.length > 1 && (
            <div className="mt-4 text-center">
              <span
                className={`
                  text-xs font-mono text-primary cursor-pointer
                  transition-transform inline-block
                  ${isExpanded ? "rotate-90" : ""}
                `}
              >
                {isExpanded ? "[-]" : "[+]"}
              </span>
            </div>
          )}
        </div>

        {/* Corner accent */}
        <div
          className={`
            absolute bottom-0 right-0 w-20 h-20 
            transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-30"}
          `}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M100 100 L100 70 Q100 100 70 100 Z"
              fill="url(#grad1)"
              className="opacity-30"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
                <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { t } = useLanguage();

  const experiences = [
    {
      company: t("exp1Company"),
      role: t("exp1Role"),
      date: t("exp1Date"),
      responsibilities: [t("exp1Resp1"), t("exp1Resp2"), t("exp1Resp3")],
    },
    {
      company: t("exp2Company"),
      role: t("exp2Role"),
      date: t("exp2Date"),
      responsibilities: [t("exp2Resp")],
    },
    {
      company: t("exp3Company"),
      role: t("exp3Role"),
      date: t("exp3Date"),
      responsibilities: [t("exp3Resp")],
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-primary neon-text">
              {t("experience")}
            </h2>
          </div>
          <div className="w-32 h-1 mx-auto animate-border-flow rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.company}
              company={exp.company}
              role={exp.role}
              date={exp.date}
              responsibilities={exp.responsibilities}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
