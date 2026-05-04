"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    name: "LARRY GARCIA",
    role: "Desarrollador de Software Semi-Senior",
    subtitle: "Especialista en IA y Automatización",
    about: "Sobre Mí",
    experience: "Experiencia",
    skills: "Habilidades",
    contact: "Contacto",
    languages: "Idiomas",
    references: "Referencias",
    profile: "Perfil Profesional",
    profileText:
      "Tecnólogo en Análisis y Desarrollo de Software (SENA) con una trayectoria enfocada en la innovación y la eficiencia operativa. Poseo una sólida capacidad para integrar API Keys de Inteligencia Artificial en el desarrollo de programas y soluciones automatizadas. Cuento con un conocimiento profundo en el ecosistema de Alibaba Cloud Qwen, lo que me permite implementar modelos de lenguaje avanzados en diversos entornos. Experto en la creación de flujos de trabajo semi-automáticos impulsados por IA y orquestación con n8n.",
    phone: "Teléfono",
    address: "Dirección",
    email: "Correo",
    aiAutomation: "IA y Automatización",
    programmingLangs: "Lenguajes de Programación",
    databases: "Bases de Datos",
    frameworks: "Frameworks y Librerías",
    tools: "Herramientas y DevOps",
    softSkills: "Habilidades Blandas",
    teamwork: "Trabajo en Equipo",
    teamworkDesc: "Colaboración efectiva en equipos multidisciplinarios, fomentando un ambiente de confianza y apoyo mutuo para alcanzar objetivos comunes.",
    communication: "Comunicación Asertiva",
    communicationDesc: "Capacidad para expresar ideas de manera clara, escuchar activamente y adaptar el mensaje según la audiencia técnica o no técnica.",
    adaptability: "Adaptabilidad",
    adaptabilityDesc: "Flexibilidad para aprender nuevas tecnologías rápidamente y ajustarme a entornos cambiantes con actitud proactiva.",
    problemSolving: "Resolución de Problemas",
    problemSolvingDesc: "Enfoque analítico y creativo para identificar soluciones eficientes ante desafíos técnicos complejos.",
    timeManagement: "Gestión del Tiempo",
    timeManagementDesc: "Organización efectiva de tareas y prioridades para cumplir con plazos establecidos sin comprometer la calidad.",
    continuousLearning: "Aprendizaje Continuo",
    continuousLearningDesc: "Pasión por mantenerme actualizado en las últimas tendencias tecnológicas y metodologías de desarrollo.",
    spanish: "Español (Nativo)",
    english: "Inglés (Intermedio)",
    present: "Actualidad",
    responsibilities: "Funciones",
    exp1Company: "Macondo Softwares",
    exp1Role: "Desarrollador de Software Semi-Senior",
    exp1Date: "10 de marzo del 2025 - Actualidad",
    exp1Resp1: "Desarrollo de mini apps de alto impacto.",
    exp1Resp2:
      "Diseño e integración de automatizaciones basadas en API Keys de IA y modelos de Alibaba Cloud Qwen.",
    exp1Resp3:
      "Liderazgo técnico en la creación de flujos de trabajo semi-automáticos con n8n para optimizar procesos empresariales.",
    exp2Company: "Hostdime S.A.S",
    exp2Role: "Aprendiz Sena (Desarrollo de Software)",
    exp2Date: "15/07/2024 - 14/01/2025",
    exp2Resp:
      "Desarrollo con Node.js y PHP, automatización con n8n, integración de APIs y gestión de flujos de WhatsApp con SendPulse.",
    exp3Company: "ESCUELA DE MUSICA (ROVIRA TOLIMA)",
    exp3Role: "Gestión TI y Desarrollo Web",
    exp3Date: "15/02/2023 - 29/05/2024",
    exp3Resp:
      "Desarrollo de aplicativos educativos y mantenimiento preventivo de hardware.",
    ref1Name: "Maria Elsy Garcia",
    ref1Type: "Familiar",
    ref2Name: "Camilo Tejada",
    ref2Type: "Personal/Docente",
    miniGame: "Mini Juego",
    catchTheCode: "¡Atrapa el Código!",
    score: "Puntuación",
    startGame: "Iniciar Juego",
    gameOver: "¡Fin del Juego!",
    playAgain: "Jugar de Nuevo",
    downloadCV: "Descargar CV",
    scrollToExplore: "Desplázate para explorar",
    welcomeMessage: "Bienvenido a mi universo digital",
    loading: "Cargando...",
    initializingSystem: "Inicializando sistema...",
    systemReady: "Sistema listo",
  },
  en: {
    name: "LARRY GARCIA",
    role: "Semi-Senior Software Developer",
    subtitle: "AI & Automation Specialist",
    about: "About Me",
    experience: "Experience",
    skills: "Skills",
    contact: "Contact",
    languages: "Languages",
    references: "References",
    profile: "Professional Profile",
    profileText:
      "Technologist in Software Analysis and Development (SENA) with a track record focused on innovation and operational efficiency. I possess a solid ability to integrate AI API Keys into the development of software programs and automated solutions. I have deep knowledge of the Alibaba Cloud Qwen ecosystem, allowing me to implement advanced language models across various environments. Expert in creating semi-automated, AI-driven workflows and orchestration using n8n.",
    phone: "Phone",
    address: "Address",
    email: "Email",
    aiAutomation: "AI & Automation",
    programmingLangs: "Programming Languages",
    databases: "Databases",
    frameworks: "Frameworks & Libraries",
    tools: "Tools & DevOps",
    softSkills: "Soft Skills",
    teamwork: "Teamwork",
    teamworkDesc: "Effective collaboration in multidisciplinary teams, fostering an environment of trust and mutual support to achieve common goals.",
    communication: "Assertive Communication",
    communicationDesc: "Ability to express ideas clearly, listen actively, and adapt messaging for both technical and non-technical audiences.",
    adaptability: "Adaptability",
    adaptabilityDesc: "Flexibility to quickly learn new technologies and adjust to changing environments with a proactive attitude.",
    problemSolving: "Problem Solving",
    problemSolvingDesc: "Analytical and creative approach to identifying efficient solutions for complex technical challenges.",
    timeManagement: "Time Management",
    timeManagementDesc: "Effective organization of tasks and priorities to meet deadlines without compromising quality.",
    continuousLearning: "Continuous Learning",
    continuousLearningDesc: "Passion for staying updated on the latest technological trends and development methodologies.",
    spanish: "Spanish (Native)",
    english: "English (Intermediate)",
    present: "Present",
    responsibilities: "Responsibilities",
    exp1Company: "Macondo Softwares",
    exp1Role: "Semi-Senior Software Developer",
    exp1Date: "March 10, 2025 - Present",
    exp1Resp1: "Development of high-impact mini-apps.",
    exp1Resp2:
      "Design and integration of automations based on AI API Keys and Alibaba Cloud Qwen models.",
    exp1Resp3:
      "Technical leadership in creating semi-automated workflows with n8n to optimize business processes.",
    exp2Company: "Hostdime S.A.S",
    exp2Role: "SENA Apprentice (Software Development)",
    exp2Date: "July 15, 2024 - January 14, 2025",
    exp2Resp:
      "Development with Node.js and PHP, automation with n8n, API integration, and WhatsApp flow management with SendPulse.",
    exp3Company: "MUSIC SCHOOL (ROVIRA TOLIMA)",
    exp3Role: "IT Management and Web Development",
    exp3Date: "February 15, 2023 - May 29, 2024",
    exp3Resp:
      "Development of educational applications and hardware preventive maintenance.",
    ref1Name: "Maria Elsy Garcia",
    ref1Type: "Family",
    ref2Name: "Camilo Tejada",
    ref2Type: "Personal/Teacher",
    miniGame: "Mini Game",
    catchTheCode: "Catch The Code!",
    score: "Score",
    startGame: "Start Game",
    gameOver: "Game Over!",
    playAgain: "Play Again",
    downloadCV: "Download CV",
    scrollToExplore: "Scroll to explore",
    welcomeMessage: "Welcome to my digital universe",
    loading: "Loading...",
    initializingSystem: "Initializing system...",
    systemReady: "System ready",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["es"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
