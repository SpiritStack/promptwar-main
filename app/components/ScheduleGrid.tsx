"use client";

import type { DailySchedule } from "@/lib/types";

interface ScheduleGridProps {
  schedule: DailySchedule;
}

const SLOT_CONFIG = {
  morning: {
    icon: "🌅",
    label: "Morning",
    timeRange: "6:00 AM – 12:00 PM",
    className: "morning",
  },
  afternoon: {
    icon: "☀️",
    label: "Afternoon",
    timeRange: "12:00 PM – 5:00 PM",
    className: "afternoon",
  },
  evening: {
    icon: "🌆",
    label: "Evening",
    timeRange: "5:00 PM – 9:00 PM",
    className: "evening",
  },
  night: {
    icon: "🌙",
    label: "Night",
    timeRange: "9:00 PM – 6:00 AM",
    className: "night",
  },
};

export default function ScheduleGrid({ schedule }: ScheduleGridProps) {
  if (!schedule.slots || schedule.slots.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        No schedule available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        Daily Medication Schedule
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schedule.slots.map((slot, i) => {
          const config = SLOT_CONFIG[slot.time_of_day] || SLOT_CONFIG.morning;
          return (
            <div
              key={i}
              className={`schedule-slot ${config.className} animate-slide-up`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl" aria-hidden="true">
                  {config.icon}
                </span>
                <div>
                  <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {config.label}
                  </h4>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {config.timeRange}
                  </p>
                </div>
              </div>

              {slot.medications.length > 0 ? (
                <div className="space-y-2">
                  {slot.medications.map((med, j) => (
                    <div
                      key={j}
                      className="p-3 rounded-lg"
                      style={{ background: "var(--bg-tertiary)" }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                          {med.name}
                        </span>
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded-md shrink-0"
                          style={{
                            background: "rgba(99, 102, 241, 0.1)",
                            color: "var(--accent-primary-light)",
                          }}
                        >
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {med.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                  No medications scheduled
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
