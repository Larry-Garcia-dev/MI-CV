"use client";

import { useLanguage } from "@/lib/language-context";
import { useState } from "react";
import { Brain, Code, Database, Layers, Wrench, Users, MessageCircle, Shuffle, Lightbulb, Clock, GraduationCap, Heart } from "lucide-react";

interface SkillBarProps {
  name: string;
  level: number;
  delay: number;
}

function SkillBar({ name, level, delay }: SkillBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-sm text-foreground/80 group-hover:text-primary transition-colors">
          {name}
        </span>
        <span
          className={`font-mono text-xs transition-all duration-300 ${
            isHovered ? "text-primary scale-110" : "text-muted-foreground"
          }`}
        >
          {level}%
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{
            width: `${level}%`,
            background: `linear-gradient(90deg, var(--primary), var(--accent))`,
            transitionDelay: `${delay}ms`,
          }}
        >
          {/* Shimmer effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 ${
              isHovered ? "translate-x-full" : "-translate-x-full"
            }`}
          />
        </div>
      </div>
      {/* Glow on hover */}
      {isHovered && (
        <div
          className="absolute -inset-2 rounded-lg opacity-20 blur-md -z-10 animate-pulse"
          style={{
            background: `linear-gradient(90deg, var(--primary), var(--accent))`,
          }}
        />
      )}
    </div>
  );
}

interface SkillCategoryProps {
  icon: React.ReactNode;
  title: string;
  skills: { name: string; level: number }[];
  index: number;
}

function SkillCategory({ icon, title, skills, index }: SkillCategoryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        glass rounded-xl p-6 border border-border 
        hover:border-primary/50 transition-all duration-300
        hover-lift relative overflow-hidden
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background glow */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${
          isHovered ? "opacity-30" : "opacity-0"
        }`}
        style={{ background: `var(--primary)` }}
      />

      <div className="flex items-center gap-3 mb-6">
        <div
          className={`p-3 rounded-lg bg-primary/10 text-primary transition-all duration-300 ${
            isHovered ? "animate-glow-pulse scale-110" : ""
          }`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-mono font-semibold text-foreground">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {skills.map((skill, i) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div
          className={`absolute -top-8 -right-8 w-16 h-16 rotate-45 transition-colors duration-300 ${
            isHovered ? "bg-primary/20" : "bg-primary/5"
          }`}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { t } = useLanguage();

  const skillCategories = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: t("aiAutomation"),
      skills: [
        { name: "Alibaba Cloud Qwen", level: 90 },
        { name: "AI API Integration", level: 85 },
        { name: "n8n Orchestration", level: 88 },
        { name: "Web Scraping", level: 80 },
      ],
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: t("programmingLangs"),
      skills: [
        { name: "JavaScript", level: 90 },
        { name: "Python", level: 85 },
        { name: "PHP", level: 80 },
        { name: "HTML/CSS", level: 92 },
      ],
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: t("databases"),
      skills: [{ name: "MySQL", level: 85 }],
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: t("frameworks"),
      skills: [
        { name: "React", level: 88 },
        { name: "Node.js", level: 85 },
        { name: "Sails.js", level: 75 },
        { name: "Laravel", level: 70 },
      ],
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: t("tools"),
      skills: [
        { name: "Git (GitHub/GitLab)", level: 88 },
        { name: "REST API", level: 90 },
        { name: "SSH/SSL/FTP", level: 80 },
        { name: "SendPulse", level: 75 },
      ],
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-primary neon-text mb-4">
            {"<"} {t("skills")} {"/>"}
          </h2>
          <div className="w-32 h-1 mx-auto animate-border-flow rounded-full" />
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={category.title}
              icon={category.icon}
              title={category.title}
              skills={category.skills}
              index={index}
            />
          ))}
        </div>

        {/* Soft Skills Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-mono font-bold text-accent mb-4 flex items-center justify-center gap-3">
              <Heart className="w-7 h-7" />
              {t("softSkills")}
            </h3>
            <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-accent to-primary rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, titleKey: "teamwork", descKey: "teamworkDesc" },
              { icon: MessageCircle, titleKey: "communication", descKey: "communicationDesc" },
              { icon: Shuffle, titleKey: "adaptability", descKey: "adaptabilityDesc" },
              { icon: Lightbulb, titleKey: "problemSolving", descKey: "problemSolvingDesc" },
              { icon: Clock, titleKey: "timeManagement", descKey: "timeManagementDesc" },
              { icon: GraduationCap, titleKey: "continuousLearning", descKey: "continuousLearningDesc" },
            ].map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.titleKey}
                  className="glass rounded-xl p-6 border border-border hover:border-accent/50 transition-all duration-300 hover-lift group relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-20 bg-accent" />
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20 shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-mono font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {t(skill.titleKey)}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(skill.descKey)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
