export default function ResultSection({ prediction, preview }) {
  if (!prediction) return null;

  const { plant_name, class_index, confidence } = prediction;
  const isLowConfidence = confidence < 50;

  // Clamp bar width
  const barWidth = Math.min(Math.max(confidence, 0), 100);

  return (
    <section className="section-card result-section">
      <span className="section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        AI Prediction
      </span>
      <h2 className="section-title">Identified Plant</h2>
      <p className="section-subtitle">
        Plant identified by the classification model.
      </p>

      <div className="result-grid">
        {/* Left: uploaded image */}
        <div className="result-image-col">
          <div className="result-image-label">Uploaded Image</div>
          <div className="result-image-frame">
            <img src={preview} alt="Uploaded plant" className="result-image" />
          </div>
        </div>

        {/* Right: prediction */}
        <div className="result-prediction-col">
          <h3 className="result-plant-name">{plant_name}</h3>

          <div className="result-confidence-block">
            <div className="result-confidence-header">
              <span className="result-confidence-label">Confidence</span>
              <span className="result-confidence-value">{confidence}%</span>
            </div>
            <div className="result-confidence-bar-bg">
              <div
                className={`result-confidence-bar ${isLowConfidence ? "result-confidence-bar--low" : ""}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {isLowConfidence && (
            <div className="result-low-conf-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Low confidence prediction. Consider uploading a clearer image.
            </div>
          )}

          <div className="result-class-index">
            Class Index: {class_index}
          </div>
        </div>
      </div>
    </section>
  );
}
