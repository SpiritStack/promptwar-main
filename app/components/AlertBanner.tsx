"use client";

import type { InteractionAlert, DuplicateAlert } from "@/lib/types";

interface AlertBannerProps {
  interactions: InteractionAlert[];
  duplicates: DuplicateAlert[];
  overallStatus: "safe" | "review_needed" | "urgent";
}

const SEVERITY_CONFIG = {
  critical: {
    icon: "🔴",
    label: "CRITICAL",
    badgeClass: "badge-critical",
    borderColor: "rgba(239, 68, 68, 0.4)",
    bgColor: "rgba(239, 68, 68, 0.06)",
  },
  high: {
    icon: "🟠",
    label: "HIGH",
    badgeClass: "badge-high",
    borderColor: "rgba(249, 115, 22, 0.4)",
    bgColor: "rgba(249, 115, 22, 0.06)",
  },
  moderate: {
    icon: "🟡",
    label: "MODERATE",
    badgeClass: "badge-moderate",
    borderColor: "rgba(234, 179, 8, 0.4)",
    bgColor: "rgba(234, 179, 8, 0.06)",
  },
  low: {
    icon: "🟢",
    label: "LOW",
    badgeClass: "badge-low",
    borderColor: "rgba(34, 197, 94, 0.4)",
    bgColor: "rgba(34, 197, 94, 0.06)",
  },
};

const STATUS_CONFIG = {
  urgent: {
    icon: "🚨",
    label: "URGENT — Immediate Review Required",
    badgeClass: "badge-urgent",
    bgGradient: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  review_needed: {
    icon: "⚠️",
    label: "Review Needed — Issues Detected",
    badgeClass: "badge-review",
    bgGradient: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(234,179,8,0.02))",
    border: "1px solid rgba(234, 179, 8, 0.3)",
  },
  safe: {
    icon: "✅",
    label: "No Significant Issues Detected",
    badgeClass: "badge-safe",
    bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))",
    border: "1px solid rgba(16, 185, 129, 0.3)",
  },
};

export default function AlertBanner({
  interactions,
  duplicates,
  overallStatus,
}: AlertBannerProps) {
  const statusConfig = STATUS_CONFIG[overallStatus];

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Overall Status Banner */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: statusConfig.bgGradient,
          border: statusConfig.border,
        }}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {statusConfig.icon}
          </span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {statusConfig.label}
            </h3>
          </div>
        </div>
      </div>

      {/* Interaction Alerts */}
      {interactions.length > 0 && (
        <div className="space-y-3">
          <h4
            className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Drug Interactions ({interactions.length})
          </h4>
          {interactions.map((interaction, i) => {
            const config = SEVERITY_CONFIG[interaction.severity];
            return (
              <div
                key={i}
                className="p-4 rounded-xl animate-slide-up"
                style={{
                  background: config.bgColor,
                  border: `1px solid ${config.borderColor}`,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5" aria-hidden="true">
                    {config.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {interaction.drugs.join(" + ")}
                      </span>
                      <span className={`badge ${config.badgeClass}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                      {interaction.description}
                    </p>
                    <p
                      className="text-sm mt-2 flex items-start gap-1.5"
                      style={{ color: "var(--accent-primary-light)" }}
                    >
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {interaction.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Duplicate Alerts */}
      {duplicates.length > 0 && (
        <div className="space-y-3">
          <h4
            className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
            Duplicate Medications ({duplicates.length})
          </h4>
          {duplicates.map((dup, i) => (
            <div
              key={i}
              className="p-4 rounded-xl animate-slide-up"
              style={{
                background: "rgba(234, 179, 8, 0.06)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5" aria-hidden="true">🔁</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {dup.medications.join(", ")}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Shared ingredient: <strong>{dup.shared_ingredient}</strong>
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {dup.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
