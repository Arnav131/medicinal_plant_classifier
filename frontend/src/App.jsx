import { useState, useRef, useCallback } from "react";
import "./components/Header.css";
import "./components/UploadSection.css";
import "./components/ResultSection.css";
import "./components/PlantInfo.css";
import "./components/ReferenceImages.css";
import "./components/Disclaimer.css";

import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import ResultSection from "./components/ResultSection";
import PlantInfo from "./components/PlantInfo";
import ReferenceImages from "./components/ReferenceImages";
import Disclaimer from "./components/Disclaimer";
import { predictPlant } from "./services/api";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, []);

  const handleIdentify = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictPlant(file);
      setResult(data);
      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <UploadSection
          file={file}
          preview={preview}
          loading={loading}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
          onIdentify={handleIdentify}
        />

        {error && (
          <div className="error-banner">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div ref={resultRef}>
            <ResultSection
              prediction={result.prediction}
              preview={preview}
            />
            <PlantInfo metadata={result.metadata} />
            <ReferenceImages
              images={result.reference_images}
              plantName={result.prediction?.plant_name}
              botanicalName={result.metadata?.botanical_name}
            />
          </div>
        )}

        <Disclaimer />
      </main>
    </div>
  );
}

export default App;
