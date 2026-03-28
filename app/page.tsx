import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)" }}
          >
            💊
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            PharmaCheck
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Promptwar 2026
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm"
            style={{
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              color: "var(--accent-primary-light)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--severity-safe)" }} />
            Powered by Gemini AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>Medication Safety </span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Audit in Seconds
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Photograph your pill bottles and prescriptions. Get a verified safety
            report with interaction alerts, duplicate detection, and a unified daily
            schedule — in under 30 seconds.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/scan" className="btn-primary text-lg" id="scan-cta">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              Scan Medications
            </Link>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              No sign-up required
            </span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16 w-full">
          <FeatureCard
            icon="🔍"
            title="Smart OCR"
            description="Reads any pill bottle label, prescription sheet, or pharmacy printout — any angle, any lighting"
          />
          <FeatureCard
            icon="🚨"
            title="Interaction Detection"
            description="Cross-references all active ingredients to find dangerous drug combinations and duplications"
          />
          <FeatureCard
            icon="📅"
            title="Unified Schedule"
            description="Consolidates all timing rules into a single plain-language daily medication schedule"
          />
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <StatItem value="< 30s" label="Analysis time" />
          <StatItem value="22" label="Languages" />
          <StatItem value="20" label="Max images/scan" />
          <StatItem value="FDA" label="Cross-referenced" />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full px-6 py-4 text-center text-xs"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <p>
          ⚠️ PharmaCheck is a decision-support tool, not a substitute for
          professional medical advice. Always consult a licensed pharmacist or
          physician.
        </p>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Built with Gemini AI · Cloud Vision · OpenFDA · Cloud Translation
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-6 text-left">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-base font-semibold mt-3" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-2xl font-bold"
        style={{
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}
