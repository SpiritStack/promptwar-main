"use client";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10, 14, 26, 0.9)", backdropFilter: "blur(8px)" }}>
      <div className="text-center space-y-6">
        {/* Animated pill icon */}
        <div className="relative w-24 h-24 mx-auto">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "3px solid var(--border-subtle)",
              borderTopColor: "var(--accent-primary)",
              animation: "spin 1s linear infinite",
            }}
          />
          {/* Inner ring */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: "3px solid var(--border-subtle)",
              borderBottomColor: "var(--accent-secondary)",
              animation: "spin 1.5s linear infinite reverse",
            }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8"
              style={{ color: "var(--accent-primary-light)", animation: "pulse 2s ease-in-out infinite" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
        </div>

        {/* Progress steps */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Analyzing Medications
          </h3>
          <div className="space-y-2 max-w-xs mx-auto">
            <ProgressStep label="Reading medication labels..." />
            <ProgressStep label="Identifying active ingredients..." delay={1} />
            <ProgressStep label="Checking drug interactions..." delay={2} />
            <ProgressStep label="Building daily schedule..." delay={3} />
          </div>
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Powered by Gemini AI · Usually takes 15–30 seconds
        </p>
      </div>
    </div>
  );
}

function ProgressStep({ label, delay = 0 }: { label: string; delay?: number }) {
  return (
    <div
      className="flex items-center gap-3 text-sm"
      style={{
        color: "var(--text-secondary)",
        opacity: 0,
        animation: `fadeIn 0.5s ease-out ${delay}s forwards`,
      }}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{
          background: "var(--accent-primary)",
          animation: `pulse 1.5s ease-in-out ${delay}s infinite`,
        }}
      />
      {label}
    </div>
  );
}
