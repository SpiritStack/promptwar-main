// ─── Medication Audit Types ─────────────────────────────────────────────────

export interface MedicationEntry {
  brand_name: string | null;
  generic_name: string;
  dosage_amount: number;
  dosage_unit: string;
  frequency: number; // times per day
  timing: string[]; // ["morning", "with food"]
  prescribing_doctor: string | null;
  needs_verification: boolean;
}

export interface InteractionAlert {
  drugs: string[]; // pair of interacting drugs
  severity: "critical" | "high" | "moderate" | "low";
  description: string;
  recommendation: string;
}

export interface DuplicateAlert {
  medications: string[]; // names of duplicated meds
  shared_ingredient: string;
  description: string;
}

export interface ScheduleSlot {
  time_of_day: "morning" | "afternoon" | "evening" | "night";
  medications: ScheduledMedication[];
}

export interface ScheduledMedication {
  name: string;
  dosage: string;
  instructions: string;
}

export interface DailySchedule {
  slots: ScheduleSlot[];
}

export interface MedicationAudit {
  medications: MedicationEntry[];
  duplicates: DuplicateAlert[];
  interactions: InteractionAlert[];
  schedule: DailySchedule;
  overall_safety_status: "safe" | "review_needed" | "urgent";
  summary: string;
  generated_at: string;
}

// ─── API Request / Response Types ───────────────────────────────────────────

export interface ScanRequest {
  images: string[]; // base64 encoded images
  patient_age?: number;
  patient_weight_kg?: number;
  allergies?: string;
  language?: string;
}

export interface ScanResponse {
  success: boolean;
  audit?: MedicationAudit;
  error?: string;
}

export interface ExportPdfRequest {
  audit: MedicationAudit;
  patient_info?: {
    age?: number;
    weight_kg?: number;
    allergies?: string;
  };
}

// ─── Supported Languages ────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
  ta: "தமிழ் (Tamil)",
  te: "తెలుగు (Telugu)",
  kn: "ಕನ್ನಡ (Kannada)",
  ml: "മലയാളം (Malayalam)",
  mr: "मराठी (Marathi)",
  bn: "বাংলা (Bengali)",
  gu: "ગુજરાતી (Gujarati)",
  pa: "ਪੰਜਾਬੀ (Punjabi)",
  ur: "اردو (Urdu)",
  es: "Español (Spanish)",
  fr: "Français (French)",
  pt: "Português (Portuguese)",
  ar: "العربية (Arabic)",
  zh: "中文 (Chinese)",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
  de: "Deutsch (German)",
  it: "Italiano (Italian)",
  ru: "Русский (Russian)",
  fil: "Filipino",
};
