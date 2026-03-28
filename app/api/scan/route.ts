import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeMedications } from "@/lib/gemini";
import { lookupMultipleDrugs } from "@/lib/openfda";

const PatientSchema = z.object({
  patient_age: z.coerce.number().min(0).max(150).optional(),
  patient_weight_kg: z.coerce.number().min(0).max(500).optional(),
  allergies: z.string().max(500).optional(),
  language: z.string().max(10).default("en"),
});

export const maxDuration = 60; // Allow up to 60 seconds for Gemini processing

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract images
    const imageFiles = formData.getAll("images") as File[];
    
    // Secure Input Validation
    const rawData = {
      patient_age: formData.get("patient_age") || undefined,
      patient_weight_kg: formData.get("patient_weight_kg") || undefined,
      allergies: formData.get("allergies") || undefined,
      language: formData.get("language") || "en",
    };

    const parsed = PatientSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid patient data format or extremely long string detected." },
        { status: 400 }
      );
    }
    const { patient_age, patient_weight_kg, allergies, language } = parsed.data;

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No images provided" },
        { status: 400 }
      );
    }

    if (imageFiles.length > 20) {
      return NextResponse.json(
        { success: false, error: "Maximum 20 images allowed per scan" },
        { status: 400 }
      );
    }

    // Convert files to base64
    const imageDataList = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          base64: buffer.toString("base64"),
          mimeType: file.type || "image/jpeg",
        };
      })
    );

    // Analyze with Gemini
    const audit = await analyzeMedications(
      imageDataList,
      patient_age,
      patient_weight_kg,
      allergies,
      language
    );

    // Cross-reference with OpenFDA (non-blocking enhancement)
    try {
      const genericNames = audit.medications.map((m) => m.generic_name);
      const fdaData = await lookupMultipleDrugs(genericNames);

      // Attach FDA verification data to response
      const fdaVerified = fdaData.filter((d) => d.found).map((d) => d.drug);
      if (fdaVerified.length > 0) {
        audit.summary += ` (${fdaVerified.length}/${genericNames.length} medications verified against FDA database)`;
      }
    } catch {
      // OpenFDA is enhancement-only; don't fail the request
      console.warn("OpenFDA lookup failed, continuing without FDA cross-reference");
    }

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error("Scan error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
