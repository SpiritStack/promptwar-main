import { NextRequest, NextResponse } from "next/server";
import { analyzeMedications } from "@/lib/gemini";
import { lookupMultipleDrugs } from "@/lib/openfda";

export const maxDuration = 60; // Allow up to 60 seconds for Gemini processing

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract images
    const imageFiles = formData.getAll("images") as File[];
    const patientAge = formData.get("patient_age")
      ? Number(formData.get("patient_age"))
      : undefined;
    const patientWeight = formData.get("patient_weight_kg")
      ? Number(formData.get("patient_weight_kg"))
      : undefined;
    const allergies = formData.get("allergies") as string | null;
    const language = (formData.get("language") as string) || "en";

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
      patientAge,
      patientWeight,
      allergies || undefined,
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
