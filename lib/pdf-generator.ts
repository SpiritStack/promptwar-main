import { jsPDF } from "jspdf";
import type { MedicationAudit } from "./types";

export async function generatePDF(
  audit: MedicationAudit,
  patientInfo?: { age?: string; weight?: string; allergies?: string }
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // ─── Header ──────────────────────────────────────────────────────────────
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 80);
  doc.text("PharmaCheck", margin, y + 7);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 140);
  doc.text("Medication Safety Audit Report", margin, y + 13);

  // Date
  const dateStr = new Date(audit.generated_at).toLocaleString();
  doc.setFontSize(8);
  doc.text(dateStr, pageWidth - margin, y + 7, { align: "right" });

  y += 20;

  // ─── Safety Status ───────────────────────────────────────────────────────
  const statusColors = {
    safe: [16, 185, 129] as [number, number, number],
    review_needed: [234, 179, 8] as [number, number, number],
    urgent: [239, 68, 68] as [number, number, number],
  };
  const statusLabels = {
    safe: "SAFE — No Significant Issues Detected",
    review_needed: "REVIEW NEEDED — Issues Detected",
    urgent: "URGENT — Immediate Review Required",
  };

  const statusColor = statusColors[audit.overall_safety_status];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(
    statusLabels[audit.overall_safety_status],
    pageWidth / 2,
    y + 6.5,
    { align: "center" }
  );

  y += 15;

  // ─── Patient Info ────────────────────────────────────────────────────────
  if (patientInfo && (patientInfo.age || patientInfo.weight || patientInfo.allergies)) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 80);
    doc.text("PATIENT INFORMATION", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 100);
    doc.setFontSize(8);

    const info: string[] = [];
    if (patientInfo.age) info.push(`Age: ${patientInfo.age}`);
    if (patientInfo.weight) info.push(`Weight: ${patientInfo.weight} kg`);
    if (patientInfo.allergies) info.push(`Allergies: ${patientInfo.allergies}`);
    doc.text(info.join("  |  "), margin, y);

    y += 8;
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80, 80, 100);
  const summaryLines = doc.splitTextToSize(audit.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 5;

  // ─── Interactions ────────────────────────────────────────────────────────
  if (audit.interactions.length > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(239, 68, 68);
    doc.text(`DRUG INTERACTIONS (${audit.interactions.length})`, margin, y);
    y += 5;

    audit.interactions.forEach((interaction) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 80);
      doc.text(
        `${interaction.severity.toUpperCase()}: ${interaction.drugs.join(" + ")}`,
        margin + 2,
        y
      );
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 100);
      const descLines = doc.splitTextToSize(interaction.description, contentWidth - 4);
      doc.text(descLines, margin + 2, y);
      y += descLines.length * 3.5;

      doc.setTextColor(50, 80, 180);
      const recLines = doc.splitTextToSize(
        `→ ${interaction.recommendation}`,
        contentWidth - 4
      );
      doc.text(recLines, margin + 2, y);
      y += recLines.length * 3.5 + 3;
    });

    y += 3;
  }

  // ─── Medications ─────────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 80);
  doc.text(`MEDICATIONS (${audit.medications.length})`, margin, y);
  y += 5;

  // Table header
  doc.setFillColor(240, 240, 248);
  doc.rect(margin, y - 1, contentWidth, 6, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 100);
  doc.text("Medication", margin + 2, y + 3);
  doc.text("Dosage", margin + 70, y + 3);
  doc.text("Frequency", margin + 100, y + 3);
  doc.text("Timing", margin + 130, y + 3);
  y += 7;

  audit.medications.forEach((med) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 80);

    const name = med.brand_name
      ? `${med.brand_name} (${med.generic_name})`
      : med.generic_name;
    doc.text(name.substring(0, 40), margin + 2, y);
    doc.text(`${med.dosage_amount}${med.dosage_unit}`, margin + 70, y);
    doc.text(`${med.frequency}x daily`, margin + 100, y);
    doc.text(med.timing.join(", ").substring(0, 25), margin + 130, y);

    y += 5;
  });

  y += 5;

  // ─── Schedule ────────────────────────────────────────────────────────────
  if (audit.schedule.slots && audit.schedule.slots.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 80);
    doc.text("DAILY SCHEDULE", margin, y);
    y += 6;

    const timeLabels = {
      morning: "Morning (6-12 PM)",
      afternoon: "Afternoon (12-5 PM)",
      evening: "Evening (5-9 PM)",
      night: "Night (9 PM-6 AM)",
    };

    audit.schedule.slots.forEach((slot) => {
      if (y > 265) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 140);
      doc.text(timeLabels[slot.time_of_day] || slot.time_of_day, margin + 2, y);
      y += 4;

      slot.medications.forEach((med) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 80);
        doc.setFontSize(7);
        doc.text(`• ${med.name} (${med.dosage}) — ${med.instructions}`, margin + 5, y);
        y += 4;
      });

      y += 2;
    });
  }

  // ─── Footer ──────────────────────────────────────────────────────────────
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 160);
  doc.text(
    "This report is for informational purposes only. Not a substitute for professional medical advice.",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );
  doc.text(
    "Generated by PharmaCheck — Powered by Gemini AI",
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );

  // Save
  doc.save(`PharmaCheck_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}
