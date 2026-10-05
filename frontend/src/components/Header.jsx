export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" opacity="0" />
              <path d="M7 20.7C7.5 17.5 8.4 14.6 12 12c3.6 2.6 4.5 5.5 5 8.7" />
              <path d="M12 12C12 8 10 5 7 3" />
              <path d="M12 12c0-4 2-7 5-9" />
              <path d="M12 12V2" />
            </svg>
          </div>
          <div>
            <h1 className="header-title">Medicinal Plant Identifier</h1>
            <p className="header-subtitle">
              Upload a leaf or plant image to identify the species and explore its documented properties.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
