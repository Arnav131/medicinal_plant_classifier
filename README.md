# 🌿 Medicinal Plant Identification Web Application

An end-to-end full-stack web application for medicinal plant identification and botanical property lookup, powered by a trained PyTorch MobileNetV3-Large classification model.

---

## 🌟 Key Features

- **AI-Powered Identification**: 150 medicinal plant species classified using the trained CbMOGEO MobileNetV3-Large model (`trainedd_cnn_model.pt`).
- **Comprehensive Medicinal Metadata**: Instant retrieval of Botanical Name, Family, Parts Used, Documented Medicinal Properties, and Reported Side Effects from `properties.csv`.
- **Confidence Scoring & Warnings**: Visual confidence bar with automatic alerts when prediction confidence is below 50%.
- **Live Reference Images**: Integration with Google Custom Search API to display real-world botanical reference photos (with fallback Google Search).
- **Medical Disclaimer**: Clear, non-intrusive safety notice advising users that the tool is for educational purposes.
- **Modern Botanical UI**: Built with React and Vite using custom CSS tokens, clean card layouts, smooth transitions, and mobile-responsive design.

---

## 📁 Project Structure

```
plant-identification-webapp/
├── backend/
│   ├── main.py              # FastAPI application & /predict endpoint
│   ├── inference.py         # PyTorch model loading and image evaluation
│   ├── metadata.py          # Read-only lookup into properties.csv
│   ├── image_search.py      # Google Custom Search API client
│   ├── requirements.txt     # Python backend dependencies
│   └── .env.example         # Environment template for API keys
├── frontend/
│   ├── src/
│   │   ├── components/      # Header, UploadSection, ResultSection, PlantInfo, ReferenceImages, Disclaimer
│   │   ├── services/api.js  # API client connecting to backend
│   │   ├── App.jsx          # Main application component
│   │   └── index.css        # Botanical design system & CSS variables
│   ├── package.json         # React + Vite dependencies
│   ├── vite.config.js       # Vite configuration with React plugin
│   └── vercel.json          # SPA routing rewrite configuration for Vercel
├── step_by_step.md          # Comprehensive Vercel deployment guide
└── README.md                # Project documentation
```

---

## 🚀 Running Locally

### 1. Backend Setup

```bash
cd plant-identification-webapp/backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- API health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Swagger interactive API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend Setup

In another terminal:

```bash
cd plant-identification-webapp/frontend
npm install
npm run dev
```

- Web App UI: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment to Vercel

For complete, step-by-step instructions with screenshots and options for hosting the ML backend on Render, Railway, or via tunnels, check:

👉 **[step_by_step.md](./step_by_step.md)**
