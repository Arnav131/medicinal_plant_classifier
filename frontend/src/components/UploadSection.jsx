import { useRef, useCallback, useState } from "react";

const ACCEPTED = ".jpg,.jpeg,.png,.webp";
const ACCEPTED_SET = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function UploadSection({
  file,
  preview,
  loading,
  onFileSelect,
  onClear,
  onIdentify,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const validateAndSelect = useCallback(
    (f) => {
      if (!f) return;
      const ext = f.name?.split(".").pop()?.toLowerCase();
      const validExt = ["jpg", "jpeg", "png", "webp"].includes(ext);
      if (!ACCEPTED_SET.has(f.type) && !validExt) {
        alert("Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.");
        return;
      }
      onFileSelect(f);
    },
    [onFileSelect]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const f = e.dataTransfer?.files?.[0];
      validateAndSelect(f);
    },
    [validateAndSelect]
  );

  return (
    <section className="section-card upload-section">
      <span className="section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </span>
      <h2 className="section-title">Upload Plant Image</h2>
      <p className="section-subtitle">
        Drag and drop an image or browse from your device. Supported formats: JPG, JPEG, PNG, WEBP.
      </p>

      {!preview ? (
        <div
          className={`upload-dropzone ${dragActive ? "upload-dropzone--active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="upload-dropzone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="upload-dropzone-text">
            <strong>Drop your image here</strong>
          </p>
          <p className="upload-dropzone-hint">or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="upload-input-hidden"
            onChange={(e) => validateAndSelect(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="upload-preview-area">
          <div className="upload-preview-wrapper">
            <img
              src={preview}
              alt="Uploaded plant"
              className="upload-preview-img"
            />
            <button
              className="upload-remove-btn"
              onClick={onClear}
              title="Remove image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="upload-file-info">
            <span className="upload-file-name">{file?.name}</span>
            <span className="upload-file-size">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : ""}
            </span>
          </div>
          <button
            className="upload-identify-btn"
            onClick={onIdentify}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="upload-spinner" />
                Analyzing image…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Identify Plant
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
