export default function ReferenceImages({ images, plantName, botanicalName }) {
  if (!images) return null;

  const hasImages = images.length > 0;

  return (
    <section className="section-card ref-images-section">
      <span className="section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Reference Images
      </span>
      <h2 className="section-title">Reference Images</h2>
      <p className="section-subtitle">
        {hasImages
          ? "Reference images retrieved for the identified plant."
          : "Automated reference images are not configured or temporarily unavailable."}
      </p>

      {hasImages ? (
        <div className="ref-images-grid">
          {images.map((img, i) => (
            <a
              key={i}
              href={img.source || img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ref-image-card"
            >
              <div className="ref-image-frame">
                <img
                  src={img.url}
                  alt={img.title || "Reference image"}
                  className="ref-image-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.parentElement.parentElement.style.display = "none";
                  }}
                />
              </div>
              {img.title && (
                <div className="ref-image-title" title={img.title}>
                  {img.title}
                </div>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="ref-images-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="15" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
          <p>
            No automated reference images loaded. Set your Google Custom Search credentials in backend/.env to display live images here.
          </p>
          {plantName && (
            <a
              href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
                `${botanicalName && botanicalName !== "Not available" ? botanicalName : plantName} medicinal plant`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ref-images-search-link"
            >
              Search images for "{plantName}" on Google ↗
            </a>
          )}
        </div>
      )}
    </section>
  );
}
