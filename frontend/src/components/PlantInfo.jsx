const FIELDS = [
  { key: "botanical_name",     label: "Botanical Name",      icon: "🌿" },
  { key: "common_name",        label: "Common Name",         icon: "📛" },
  { key: "family",             label: "Family",              icon: "🏷️" },
  { key: "parts_used",         label: "Parts Used",          icon: "🧪" },
  { key: "medicinal_property", label: "Medicinal Properties", icon: "💊" },
  { key: "side_effects",       label: "Side Effects",        icon: "⚠️" },
];

export default function PlantInfo({ metadata }) {
  if (!metadata) return null;

  return (
    <section className="section-card plant-info-section">
      <span className="section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Documented Information
      </span>
      <h2 className="section-title">Plant Information</h2>
      <p className="section-subtitle">
        Information sourced from the project's metadata records.
      </p>

      <div className="plant-info-grid">
        {FIELDS.map(({ key, label, icon }) => (
          <div
            key={key}
            className={`plant-info-card ${
              key === "medicinal_property" || key === "side_effects"
                ? "plant-info-card--wide"
                : ""
            }`}
          >
            <div className="plant-info-card-icon">{icon}</div>
            <div className="plant-info-card-label">{label}</div>
            <div className="plant-info-card-value">
              {metadata[key] || "Not available"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
