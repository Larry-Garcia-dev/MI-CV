"use client";

import { useLanguage } from "@/lib/language-context";
import { useState } from "react";
import { Phone, MapPin, Mail, Send, Copy, Check, Globe } from "lucide-react";

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  index: number;
}

function ContactCard({ icon, label, value, href, index }: ContactCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div
      className={`
        glass rounded-xl p-6 border border-border
        hover:border-primary/50 transition-all duration-300
        hover-lift relative overflow-hidden group cursor-pointer
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Animated background */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`
            p-3 rounded-lg bg-primary/10 text-primary
            transition-all duration-300
            ${isHovered ? "scale-110 animate-glow-pulse" : ""}
          `}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="font-mono text-foreground truncate group-hover:text-primary transition-colors">
            {value}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopy();
          }}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${copied ? "bg-green-500/20 text-green-500" : "bg-secondary/50 text-muted-foreground hover:text-primary"}
          `}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Decorative corner */}
      <div
        className={`
          absolute bottom-0 right-0 w-16 h-16 
          transition-all duration-300
          ${isHovered ? "opacity-100 scale-110" : "opacity-30 scale-100"}
        `}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M100 100 L100 50 Q100 100 50 100 Z"
            fill="url(#contactGrad)"
            className="opacity-30"
          />
          <defs>
            <linearGradient
              id="contactGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
              <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

export function ContactSection() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: t("phone"),
      value: "+57 3173328716",
      href: "tel:+573173328716",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: t("email"),
      value: "windonpc125@gmail.com",
      href: "mailto:windonpc125@gmail.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: t("address"),
      value: "Bogota-DC-Dg. 52b Sur #53-08",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: t("languages"),
      value: `${t("spanish")} / ${t("english")}`,
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Send className="w-8 h-8 text-primary animate-float" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-primary neon-text">
              {t("contact")}
            </h2>
          </div>
          <div className="w-32 h-1 mx-auto animate-border-flow rounded-full" />
        </div>

        {/* Contact cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactInfo.map((info, index) => (
            <ContactCard
              key={info.label}
              icon={info.icon}
              label={info.label}
              value={info.value}
              href={info.href}
              index={index}
            />
          ))}
        </div>

        {/* References */}
        <div className="mt-16">
          <h3 className="text-xl font-mono font-bold text-accent mb-6 text-center">
            {t("references")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: t("ref1Name"),
                type: t("ref1Type"),
                phone: "3104795188",
              },
              {
                name: t("ref2Name"),
                type: t("ref2Type"),
                phone: "3137797105",
              },
            ].map((ref, index) => (
              <div
                key={ref.name}
                className="glass rounded-xl p-4 border border-border hover:border-accent/50 transition-all hover-lift"
              >
                <p className="font-mono font-semibold text-foreground">
                  {ref.name}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {ref.type}
                </p>
                <a
                  href={`tel:+57${ref.phone}`}
                  className="text-sm text-primary hover:text-accent transition-colors font-mono"
                >
                  +57 {ref.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
