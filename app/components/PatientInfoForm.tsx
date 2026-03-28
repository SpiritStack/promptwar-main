"use client";

interface PatientInfoFormProps {
  age: string;
  weight: string;
  allergies: string;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onAllergiesChange: (value: string) => void;
}

export default function PatientInfoForm({
  age,
  weight,
  allergies,
  onAgeChange,
  onWeightChange,
  onAllergiesChange,
}: PatientInfoFormProps) {
  return (
    <div className="glass-card-static p-5">
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        Patient Information (Optional)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patient-age" className="input-label">
            Age
          </label>
          <input
            id="patient-age"
            type="number"
            min="0"
            max="150"
            className="input-field"
            placeholder="e.g. 72"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="patient-weight" className="input-label">
            Weight (kg)
          </label>
          <input
            id="patient-weight"
            type="number"
            min="0"
            max="500"
            className="input-field"
            placeholder="e.g. 65"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="patient-allergies" className="input-label">
            Known Allergies
          </label>
          <input
            id="patient-allergies"
            type="text"
            className="input-field"
            placeholder="e.g. Penicillin, Sulfa drugs"
            value={allergies}
            onChange={(e) => onAllergiesChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
