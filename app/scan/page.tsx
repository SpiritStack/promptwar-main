"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraCapture from "@/app/components/CameraCapture";
import PatientInfoForm from "@/app/components/PatientInfoForm";
import LanguagePicker from "@/app/components/LanguagePicker";
import LoadingAnimation from "@/app/components/LoadingAnimation";

export default function ScanPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [language, setLanguage] = useState("en");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload at least one medication image.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      if (age) formData.append("patient_age", age);
      if (weight) formData.append("patient_weight_kg", weight);
      if (allergies) formData.append("allergies", allergies);
      formData.append("language", language);

      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      // Store results in sessionStorage and navigate
      sessionStorage.setItem("pharmacheck_audit", JSON.stringify(data.audit));
      sessionStorage.setItem(
        "pharmacheck_patient",
        JSON.stringify({ age, weight, allergies })
      );
      router.push("/results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {isAnalyzing && <LoadingAnimation />}

      {/* Header */}
      <header
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)" }}
          >
            💊
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            PharmaCheck
          </span>
        </Link>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          Medication Scanner
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Scan Medications
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Photograph your pill bottles, prescription sheets, or pharmacy labels.
            Gemini AI will analyze everything and check for interactions.
          </p>
        </div>

        {/* Step 1: Upload Images */}
        <section>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: "var(--accent-primary)", color: "white" }}
            >
              1
            </span>
            Upload Medication Images
          </h2>
          <CameraCapture onImagesSelected={setFiles} />
        </section>

        {/* Step 2: Patient Info */}
        <section>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: "var(--accent-primary)", color: "white" }}
            >
              2
            </span>
            Patient Details
          </h2>
          <PatientInfoForm
            age={age}
            weight={weight}
            allergies={allergies}
            onAgeChange={setAge}
            onWeightChange={setWeight}
            onAllergiesChange={setAllergies}
          />
        </section>

        {/* Step 3: Language */}
        <section>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: "var(--accent-primary)", color: "white" }}
            >
              3
            </span>
            Report Language
          </h2>
          <div className="glass-card-static p-5">
            <LanguagePicker
              selectedLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            className="p-4 rounded-xl flex items-start gap-3"
            role="alert"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <span>⚠️</span>
            <p className="text-sm" style={{ color: "var(--severity-critical)" }}>
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={files.length === 0 || isAnalyzing}
          className="btn-primary w-full text-lg"
          id="analyze-btn"
        >
          {isAnalyzing ? (
            <>
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              Analyse {files.length > 0 ? `${files.length} Image${files.length !== 1 ? "s" : ""}` : "Medications"}
            </>
          )}
        </button>
      </main>
    </div>
  );
}
