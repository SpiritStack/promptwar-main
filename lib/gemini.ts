import { GoogleGenAI } from "@google/genai";
import type { MedicationAudit } from "./types";

const SYSTEM_PROMPT = `You are a clinical pharmacist assistant. Your job is to extract complete,
accurate medication information from images of pill bottles, prescription
labels, and pharmacy printouts. You must be conservative — if any field
is ambiguous, mark it as "needs_verification": true rather than guessing.
Never invent drug names, dosages, or frequencies. Patient safety depends
on your accuracy.

Always respond with valid JSON matching the MedicationAudit schema.
Do not include any prose, markdown, or explanation outside the JSON object.`;

function buildUserPrompt(
  imageCount: number,
  patientAge?: number,
  patientWeight?: number,
  allergies?: string,
  language?: string
): string {
  const langInstruction =
    language && language !== "en"
      ? `\n\nIMPORTANT: All text fields in the response (description, recommendation, instructions, summary, medication names should keep their English medical names but add translations in parentheses) must be translated to ${language}. Keep drug names in English for safety.`
      : "";

  return `Analyse the following ${imageCount} medication image(s).

For each medication identified, extract:
- brand_name (if visible, otherwise null)
- generic_name (active ingredient)
- dosage_amount (numeric value)
- dosage_unit (mg, mcg, ml, etc.)
- frequency (times per day as integer)
- timing (array of strings like "morning", "with food", "before bed", etc.)
- prescribing_doctor (if visible, otherwise null)
- needs_verification (true if any field is uncertain)

Then identify:
- Any medications with identical or overlapping active ingredients (duplicates). For each, provide the shared_ingredient and a clear description.
- Any known contraindicated combinations (interactions). For each, rate severity as "critical", "high", "moderate", or "low" and provide a description and recommendation.
- Any dosage values that appear outside typical therapeutic ranges

Generate a consolidated daily schedule with 4 time slots: morning, afternoon, evening, night.
For each scheduled medication, include the name, dosage string (e.g. "500mg"), and plain-language instructions.

Set overall_safety_status to:
- "urgent" if any critical or high severity interactions exist
- "review_needed" if moderate interactions or duplicates exist
- "safe" if no significant issues found

Provide a brief summary (2-3 sentences) of the overall medication safety assessment.

Patient context:
- Age: ${patientAge ?? "Unknown"}
- Weight: ${patientWeight ? `${patientWeight} kg` : "Unknown"}
- Declared allergies: ${allergies || "None declared"}
${langInstruction}

Return ONLY a valid JSON object with this exact structure:
{
  "medications": [
    {
      "brand_name": "string or null",
      "generic_name": "string",
      "dosage_amount": number,
      "dosage_unit": "string",
      "frequency": number,
      "timing": ["string"],
      "prescribing_doctor": "string or null",
      "needs_verification": boolean
    }
  ],
  "duplicates": [
    {
      "medications": ["string"],
      "shared_ingredient": "string",
      "description": "string"
    }
  ],
  "interactions": [
    {
      "drugs": ["string", "string"],
      "severity": "critical|high|moderate|low",
      "description": "string",
      "recommendation": "string"
    }
  ],
  "schedule": {
    "slots": [
      {
        "time_of_day": "morning|afternoon|evening|night",
        "medications": [
          {
            "name": "string",
            "dosage": "string",
            "instructions": "string"
          }
        ]
      }
    ]
  },
  "overall_safety_status": "safe|review_needed|urgent",
  "summary": "string",
  "generated_at": "ISO 8601 timestamp"
}`;
}

export async function analyzeMedications(
  imageDataList: { base64: string; mimeType: string }[],
  patientAge?: number,
  patientWeight?: number,
  allergies?: string,
  language?: string
): Promise<MedicationAudit> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'Referer': 'https://pharmacheck-912142069838.us-central1.run.app/'
      }
    }
  });

  const imageParts = imageDataList.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
    },
  }));

  const userPrompt = buildUserPrompt(
    imageDataList.length,
    patientAge,
    patientWeight,
    allergies,
    language
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [...imageParts, { text: userPrompt }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  try {
    const audit: MedicationAudit = JSON.parse(text);
    // Ensure generated_at is set
    if (!audit.generated_at) {
      audit.generated_at = new Date().toISOString();
    }
    return audit;
  } catch {
    throw new Error(
      `Failed to parse Gemini response as JSON: ${text.substring(0, 200)}`
    );
  }
}
