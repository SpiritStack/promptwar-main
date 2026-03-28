"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { MedicationAudit } from "@/lib/types";
import MedicationCard from "@/app/components/MedicationCard";
import AlertBanner from "@/app/components/AlertBanner";
import ScheduleGrid from "@/app/components/ScheduleGrid";
import { generatePDF } from "@/lib/pdf-generator";

export default function ResultsPage() {
  const [audit, setAudit] = useState<MedicationAudit | null>(null);
  const [patientInfo, setPatientInfo] = useState<{
    age?: string;
    weight?: string;
    allergies?: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const auditData = sessionStorage.getItem("pharmacheck_audit");
    const patientData = sessionStorage.getItem("pharmacheck_patient");

    if (auditData) {
      try {
        setAudit(JSON.parse(auditData));
      } catch {
        // Invalid data
      }
    }

    if (patientData) {
      try {
        setPatientInfo(JSON.parse(patientData));
      } catch {
        // Invalid data
      }
    }
  }, []);

  const handleExportPDF = async () => {
    if (!audit) return;
    setIsExporting(true);
    try {
      await generatePDF(audit, patientInfo || undefined);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
    setIsExporting(false);
  };

  if (!audit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="space-y-4">
          <span className="text-4xl">📋</span>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            No Results Available
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Scan your medications first to see the analysis results.
          </p>
          <Link href="/scan" className="btn-primary inline-flex">
            Scan Medications
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(audit.generated_at).toLocaleString();

  return (
    <div className="flex-1 flex flex-col">
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-secondary text-sm"
            id="export-pdf-btn"
          >
            {isExporting ? (
              <>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    border: "2px solid var(--border-medium)",
                    borderTopColor: "var(--accent-primary)",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Export PDF
              </>
            )}
          </button>
          <Link href="/scan" className="btn-secondary text-sm">
            New Scan
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Medication Safety Report
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Generated {formattedDate} · {audit.medications.length} medication
              {audit.medications.length !== 1 ? "s" : ""} identified
            </p>
          </div>
          <StatusBadge status={audit.overall_safety_status} />
        </div>

        {/* Summary */}
        <div
          className="glass-card-static p-5"
        >
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {audit.summary}
          </p>
        </div>

        {/* Alerts */}
        {(audit.interactions.length > 0 ||
          audit.duplicates.length > 0 ||
          audit.overall_safety_status !== "safe") && (
          <section>
            <AlertBanner
              interactions={audit.interactions}
              duplicates={audit.duplicates}
              overallStatus={audit.overall_safety_status}
            />
          </section>
        )}

        {/* Medications List */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            Identified Medications ({audit.medications.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {audit.medications.map((med, i) => (
              <MedicationCard key={i} medication={med} index={i} />
            ))}
          </div>
        </section>

        {/* Schedule */}
        <section>
          <ScheduleGrid schedule={audit.schedule} />
        </section>

        {/* Disclaimer */}
        <div
          className="text-center py-6 text-xs"
          style={{
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <p>
            ⚠️ This report is for informational purposes only. It is not a
            substitute for professional medical advice. Always consult a licensed
            pharmacist or physician before making changes to your medications.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "safe" | "review_needed" | "urgent";
}) {
  const config = {
    safe: { label: "✅ Safe", className: "badge-safe" },
    review_needed: { label: "⚠️ Review Needed", className: "badge-review" },
    urgent: { label: "🚨 Urgent", className: "badge-urgent" },
  };
  const c = config[status];

  return (
    <span className={`badge text-sm ${c.className}`}>
      {c.label}
    </span>
  );
}
