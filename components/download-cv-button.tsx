"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { jsPDF } from "jspdf";

export function DownloadCVButton() {
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // Colors
      const primaryColor: [number, number, number] = [0, 0, 0]; // Black for titles
      const accentColor: [number, number, number] = [50, 50, 50]; // Dark gray for accents
      const textColor: [number, number, number] = [0, 0, 0]; // Black for text
      const mutedColor: [number, number, number] = [80, 80, 80]; // Gray for secondary text
      const bgColor: [number, number, number] = [255, 255, 255]; // White background

      // Background
      pdf.setFillColor(...bgColor);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Header line
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageWidth, 3, "F");

      // Header section with photo on left and text on right
      const imgSize = 40;
      const headerStartY = yPosition + 5;
      const textStartX = margin + imgSize + 10;
      
      // Profile photo on the left
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/images/profile.jpg";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          setTimeout(reject, 3000);
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL("image/jpeg", 0.8);
          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            headerStartY,
            imgSize,
            imgSize
          );
        }
      } catch {
        // If image fails, continue without it
      }

      // Name on the right of photo
      let textY = headerStartY + 8;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(...primaryColor);
      pdf.text(t("name"), textStartX, textY);
      textY += 10;

      // Role
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(...textColor);
      pdf.text(t("role"), textStartX, textY);
      textY += 7;

      // Subtitle
      pdf.setFontSize(10);
      pdf.setTextColor(...accentColor);
      pdf.text(t("subtitle"), textStartX, textY);
      
      yPosition = headerStartY + imgSize + 8;

      // Divider
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Helper function for sections
      const addSection = (title: string, yPos: number): number => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(...primaryColor);
        pdf.text(title.toUpperCase(), margin, yPos);
        yPos += 2;
        pdf.setDrawColor(...accentColor);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPos, margin + 40, yPos);
        return yPos + 8;
      };

      // Check if we need a new page
      const checkPageBreak = (currentY: number, neededSpace: number): number => {
        if (currentY + neededSpace > pageHeight - margin) {
          pdf.addPage();
          pdf.setFillColor(...bgColor);
          pdf.rect(0, 0, pageWidth, pageHeight, "F");
          pdf.setFillColor(...primaryColor);
          pdf.rect(0, 0, pageWidth, 3, "F");
          return margin + 5;
        }
        return currentY;
      };

      // PROFILE SECTION
      yPosition = addSection(t("profile"), yPosition);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);
      const profileLines = pdf.splitTextToSize(t("profileText"), contentWidth);
      pdf.text(profileLines, margin, yPosition);
      yPosition += profileLines.length * 5 + 10;

      // CONTACT SECTION
      yPosition = checkPageBreak(yPosition, 40);
      yPosition = addSection(t("contact"), yPosition);
      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);

      const contactItems = [
        { label: t("phone"), value: "+57 3173328716" },
        { label: t("email"), value: "windonpc125@gmail.com" },
        { label: t("address"), value: "Bogota-DC-Dg. 52b Sur #53-08" },
        { label: t("languages"), value: `${t("spanish")} / ${t("english")}` },
      ];

      contactItems.forEach((item) => {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...mutedColor);
        pdf.text(`${item.label}: `, margin, yPosition);
        const labelWidth = pdf.getTextWidth(`${item.label}: `);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...textColor);
        pdf.text(item.value, margin + labelWidth, yPosition);
        yPosition += 6;
      });
      yPosition += 6;

      // EXPERIENCE SECTION
      yPosition = checkPageBreak(yPosition, 60);
      yPosition = addSection(t("experience"), yPosition);

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

      experiences.forEach((exp) => {
        yPosition = checkPageBreak(yPosition, 30);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(...textColor);
        pdf.text(exp.company, margin, yPosition);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...mutedColor);
        pdf.text(exp.date, pageWidth - margin, yPosition, { align: "right" });
        yPosition += 5;

        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.setTextColor(...accentColor);
        pdf.text(exp.role, margin, yPosition);
        yPosition += 6;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...textColor);
        exp.responsibilities.forEach((resp) => {
          yPosition = checkPageBreak(yPosition, 8);
          const respLines = pdf.splitTextToSize(`• ${resp}`, contentWidth - 5);
          pdf.text(respLines, margin + 3, yPosition);
          yPosition += respLines.length * 4 + 2;
        });
        yPosition += 4;
      });

      // TECHNICAL SKILLS SECTION
      yPosition = checkPageBreak(yPosition, 50);
      yPosition = addSection(t("skills"), yPosition);

      const skillCategories = [
        {
          title: t("aiAutomation"),
          skills: ["Alibaba Cloud Qwen", "AI API Integration", "n8n Orchestration", "Web Scraping"],
        },
        {
          title: t("programmingLangs"),
          skills: ["JavaScript", "Python", "PHP", "HTML/CSS"],
        },
        {
          title: t("databases"),
          skills: ["MySQL"],
        },
        {
          title: t("frameworks"),
          skills: ["React", "Node.js", "Sails.js", "Laravel"],
        },
        {
          title: t("tools"),
          skills: ["Git (GitHub/GitLab)", "REST API", "SSH/SSL/FTP", "SendPulse"],
        },
        {
          title: t("systems"),
          skills: ["Linux (Ubuntu/Debian)", "Windows Server", "Docker", "Terminal/Bash"],
        },
      ];

      const colWidth = contentWidth / 2;
      let col = 0;
      let rowStartY = yPosition;

      skillCategories.forEach((category, index) => {
        const xPos = margin + col * colWidth;

        if (col === 0 && index > 0) {
          yPosition = checkPageBreak(yPosition, 25);
          rowStartY = yPosition;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...accentColor);
        pdf.text(category.title, xPos, yPosition);

        let tempY = yPosition + 5;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...textColor);
        category.skills.forEach((skill) => {
          pdf.text(`• ${skill}`, xPos + 2, tempY);
          tempY += 4;
        });

        if (col === 0) {
          col = 1;
        } else {
          col = 0;
          yPosition = Math.max(rowStartY + 25, tempY) + 3;
        }
      });

      if (col === 1) {
        yPosition = rowStartY + 25;
      }
      yPosition += 5;

      // SOFT SKILLS SECTION
      yPosition = checkPageBreak(yPosition, 40);
      yPosition = addSection(t("softSkills"), yPosition);

      const softSkills = [
        t("teamwork"),
        t("communication"),
        t("adaptability"),
        t("problemSolving"),
        t("timeManagement"),
        t("continuousLearning"),
      ];

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);

      const softSkillsText = softSkills.join(" • ");
      const softSkillLines = pdf.splitTextToSize(softSkillsText, contentWidth);
      pdf.text(softSkillLines, margin, yPosition);
      yPosition += softSkillLines.length * 5 + 10;

      // REFERENCES SECTION
      yPosition = checkPageBreak(yPosition, 30);
      yPosition = addSection(t("references"), yPosition);

      const references = [
        { name: t("ref1Name"), type: t("ref1Type"), phone: "+57 3104795188" },
        { name: t("ref2Name"), type: t("ref2Type"), phone: "+57 3137797105" },
      ];

      references.forEach((ref) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...textColor);
        pdf.text(ref.name, margin, yPosition);
        yPosition += 4;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...mutedColor);
        pdf.text(`${ref.type} - ${ref.phone}`, margin, yPosition);
        yPosition += 7;
      });

      // Footer
      const footerY = pageHeight - 10;
      pdf.setFontSize(8);
      pdf.setTextColor(...mutedColor);
      pdf.text(
        language === "es" ? "Generado desde mi CV digital" : "Generated from my digital CV",
        pageWidth / 2,
        footerY,
        { align: "center" }
      );

      // Download
      const fileName = language === "es" ? "Larry_Garcia_CV_ES.pdf" : "Larry_Garcia_CV_EN.pdf";
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="
        group fixed bottom-6 right-6 z-50
        flex items-center gap-2 px-5 py-3
        bg-primary/10 backdrop-blur-md
        border border-primary/50 rounded-full
        font-mono text-sm text-primary
        hover:bg-primary/20 hover:border-primary
        hover:shadow-lg hover:shadow-primary/20
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="hidden sm:inline">
            {language === "es" ? "Generando..." : "Generating..."}
          </span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5 group-hover:animate-bounce" />
          <span className="hidden sm:inline">{t("downloadCV")}</span>
        </>
      )}
    </button>
  );
}
