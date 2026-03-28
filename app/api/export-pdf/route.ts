import { NextRequest, NextResponse } from "next/server";
import type { MedicationAudit } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const audit: MedicationAudit = body.audit;
    const patientInfo = body.patient_info;

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "No audit data provided" },
        { status: 400 }
      );
    }

    // We'll generate PDF on the client side using jsPDF
    // This endpoint provides a structured JSON for client-side PDF generation
    const pdfData = {
      title: "PharmaCheck — Medication Safety Audit",
      generated_at: audit.generated_at,
      patient: {
        age: patientInfo?.age ?? "Not provided",
        weight: patientInfo?.weight_kg
          ? `${patientInfo.weight_kg} kg`
          : "Not provided",
        allergies: patientInfo?.allergies ?? "None declared",
      },
      safety_status: audit.overall_safety_status,
      summary: audit.summary,
      medications: audit.medications.map((m) => ({
        name: m.brand_name
          ? `${m.brand_name} (${m.generic_name})`
          : m.generic_name,
        dosage: `${m.dosage_amount}${m.dosage_unit}`,
        frequency: `${m.frequency}x daily`,
        timing: m.timing.join(", "),
        verified: !m.needs_verification,
      })),
      interactions: audit.interactions.map((i) => ({
        drugs: i.drugs.join(" + "),
        severity: i.severity,
        description: i.description,
        recommendation: i.recommendation,
      })),
      duplicates: audit.duplicates.map((d) => ({
        medications: d.medications.join(", "),
        shared_ingredient: d.shared_ingredient,
        description: d.description,
      })),
      schedule: audit.schedule,
    };

    return NextResponse.json({ success: true, pdfData });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to prepare PDF data" },
      { status: 500 }
    );
  }
}
