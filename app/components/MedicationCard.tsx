"use client";

import type { MedicationEntry } from "@/lib/types";

interface MedicationCardProps {
  medication: MedicationEntry;
  index: number;
}

export default function MedicationCard({ medication, index }: MedicationCardProps) {
  return (
    <div
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {medication.brand_name || medication.generic_name}
            </h3>
            {medication.needs_verification && (
              <span className="badge badge-moderate">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Needs Verification
              </span>
            )}
          </div>
          {medication.brand_name && (
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {medication.generic_name}
            </p>
          )}
        </div>

        <div
          className="text-right px-3 py-1.5 rounded-lg shrink-0"
          style={{ background: "rgba(99, 102, 241, 0.1)" }}
        >
          <div className="text-lg font-bold" style={{ color: "var(--accent-primary-light)" }}>
            {medication.dosage_amount}
            <span className="text-sm font-normal ml-0.5">{medication.dosage_unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoChip
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Frequency"
          value={`${medication.frequency}x daily`}
        />
        <InfoChip
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
          label="Timing"
          value={medication.timing.join(", ") || "As directed"}
        />
      </div>

      {medication.prescribing_doctor && (
        <div
          className="mt-3 pt-3 flex items-center gap-2 text-xs"
          style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          Prescribed by {medication.prescribing_doctor}
        </div>
      )}
    </div>
  );
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: "var(--bg-tertiary)" }}
    >
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
