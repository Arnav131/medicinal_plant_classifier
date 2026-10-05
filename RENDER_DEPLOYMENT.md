# 🚀 All-in-One Deployment on Render: Medicinal Plant App

Yes! You can deploy the **entire application (both the React frontend and PyTorch backend)** together on **Render** as a single, unified web service.

---

## 🌟 Why Deploying Everything on Render is Better

| Feature | Split (Vercel + Backend) | Unified on Render (Recommended) |
| :--- | :--- | :--- |
| **Number of Services** | 2 different platforms | **1 single Render service** |
| **Domain / URL** | 2 separate URLs | **1 single clean URL** (e.g. `https://my-plant-app.onrender.com`) |
| **CORS Configuration** | Required | **Zero CORS issues** (Frontend & Backend share the same host) |
| **Setup Complexity** | Higher | **1-click Git deployment** via Docker |

---

## 📁 Step 1: Clean Your GitHub Repository (Upload Only the Webapp)

Right now, your GitHub repository contains the entire research folder (`test/` images, `.ipynb` notebooks, `visualizations/`). 

To make your repository clean and contain **ONLY** `plant-identification-webapp`:

### Option A: Make `plant-identification-webapp` the root of your Git repository

Open your terminal and run these commands:

```bash
# 1. Navigate to the webapp folder
cd "c:\Users\arnav\Downloads\CbMOGEO_benchmark_deliverables (1)\plant-identification-webapp"

# 2. Initialize a clean git repository inside this folder only
git init
git add .
git commit -m "Initial commit of self-contained plant identification webapp"

# 3. Point to your GitHub repo and force push (replaces everything with just the webapp)
git branch -M main
git remote add origin https://github.com/Arnav131/medicinal_plant_classifier.git
git push -u origin main --force
```

Now, when you refresh your GitHub repository, it will have:
```
medicinal_plant_classifier/
├── backend/            # FastAPI, PyTorch model, properties.csv
├── frontend/           # React + Vite UI
├── Dockerfile          # Multi-stage build for Render
├── .dockerignore
└── README.md
```
*(No test images, no notebooks, perfectly clean and lightweight!)*

---

## ☁️ Step 2: Deploy to Render (3 Minutes)

1. **Sign up / Log in to [Render](https://dashboard.render.com/)**.
2. Click **New +** (top right) → **Web Service**.
3. Under **Connect a Git repository**, choose `Arnav131/medicinal_plant_classifier` and click **Connect**.
4. Render will inspect your repo and automatically detect the `Dockerfile`:
   - **Name**: `medicinal-plant-identifier` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., Singapore, Oregon, Frankfurt)
   - **Branch**: `main`
   - **Runtime**: **Docker** *(auto-detected)*
   - **Instance Type**: **Free**
5. *(Optional)* If you have Google Custom Search API keys for live web images, expand **Environment Variables** and add:
   - `GOOGLE_API_KEY`: `your_key`
   - `GOOGLE_SEARCH_ENGINE_ID`: `your_engine_id`
6. Click **Deploy Web Service**! 🚀

---

## ⚙️ How Render Builds It Automatically

Render uses the included **`Dockerfile`**:
1. **Stage 1**: Installs Node.js 20 and runs `npm run build` to build your React frontend into optimized static files (`frontend/dist`).
2. **Stage 2**: Installs Python 3.10 and PyTorch dependencies from `requirements.txt`.
3. Copies your model checkpoint (`trainedd_cnn_model.pt`) and `properties.csv`.
4. Starts Uvicorn: FastAPI serves your React UI at `/` and your ML prediction endpoint at `/predict`!

---

## 🔍 Step 3: Test Your Live App

Once Render finishes building (usually 2–4 minutes on the first build):
1. Render gives you your live URL:
   ```
   https://medicinal-plant-identifier.onrender.com
   ```
2. Open the URL in your browser:
   - Your botanical web UI loads instantly.
   - Upload any leaf photo and click **Identify Plant**.
   - The ML model runs inference and returns the predicted species and medicinal properties directly on the same domain!
