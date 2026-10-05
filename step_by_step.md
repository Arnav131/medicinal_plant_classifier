# 🌿 Step-by-Step Deployment Guide: Medicinal Plant Identifier

This guide walks you through deploying your **Medicinal Plant Identification Web Application** to **Vercel** with your existing Vercel account.

---

## 📐 Architecture Overview

Before deploying, understand how modern machine learning web apps are structured:

```
┌────────────────────────────────────────────────────────┐
│                   USER'S BROWSER                       │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
   ┌──────────────────────┐    ┌──────────────────────┐
   │  Vercel (Frontend)   │    │ Backend (ML Engine)  │
   │   React + Vite SPA   │    │  FastAPI + PyTorch   │
   │  Ultra-fast edge CDN │    │  MobileNetV3 + Model │
   └──────────────────────┘    └──────────────────────┘
```

> [!IMPORTANT]
> **Why is the frontend on Vercel and backend hosted separately?**
> - **Vercel** excels at hosting static frontend applications (Vite, React, Next.js).
> - However, Vercel Serverless Functions have a strict **50 MB bundle size limit** (250 MB uncompressed).
> - PyTorch (`torch` + `torchvision`) alone requires **over 800 MB**, which will fail Vercel's serverless size limit.
> - **The industry-standard solution:**
>   1. Deploy the **Frontend (Vite / React)** to **Vercel** (free, instant global CDN).
>   2. Deploy the **Backend (FastAPI + PyTorch + Model)** to a container host like **Render**, **Railway**, or **Hugging Face Spaces** (free tier available).
>   3. Connect them via the `VITE_API_URL` environment variable.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
3. [Step 2: Deploy the Backend (FastAPI + Model)](#step-2-deploy-the-backend-fastapi--model)
   - [Option A: Deploy to Render (Free & Recommended)](#option-a-deploy-to-render-free--recommended)
   - [Option B: Quick Test via Cloudflare Tunnel / ngrok](#option-b-quick-test-via-cloudflare-tunnel--ngrok)
4. [Step 3: Deploy the Frontend to Vercel](#step-3-deploy-the-frontend-to-vercel)
   - [Method 1: Using the Vercel Web Dashboard (Recommended)](#method-1-using-the-vercel-web-dashboard-recommended)
   - [Method 2: Using the Vercel CLI](#method-2-using-the-vercel-cli)
5. [Step 4: Configure Environment Variables on Vercel](#step-4-configure-environment-variables-on-vercel)
6. [Step 5: Testing & Verification](#step-5-testing--verification)
7. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Prerequisites

- A **[Vercel](https://vercel.com/)** account.
- A **[GitHub](https://github.com/)** account.
- A free account on **[Render](https://render.com/)** (or Railway / Hugging Face) for hosting the Python ML backend.
- (Optional) Google Custom Search API Key & Search Engine ID if you want live Google reference images.

---

## Step 1: Push Code to GitHub

1. Open your terminal in the project directory:
   ```bash
   git init
   git add .
   git commit -m "Add medicinal plant identifier fullstack webapp"
   ```

2. Create a new repository on [GitHub](https://github.com/new).

3. Push your repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

> [!NOTE]
> Ensure `trainedd_cnn_model.pt` and `properties.csv` are tracked in Git (or uploaded via Git LFS if Git warns about file size over 100MB). The model checkpoint is ~16MB, which fits easily within GitHub's 100MB normal limit.

---

## Step 2: Deploy the Backend (FastAPI + Model)

### Option A: Deploy to Render (Free & Recommended)

1. Sign up / Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following deployment settings:
   - **Name**: `plant-classifier-api`
   - **Root Directory**: Leave blank (or project root)
   - **Environment**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r plant-identification-webapp/backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     cd plant-identification-webapp/backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
5. In **Environment Variables**, add:
   - `MODEL_CHECKPOINT`: `../../trainedd_cnn_model.pt` (or absolute path inside Render)
   - `PROPERTIES_CSV`: `../../properties.csv`
   - `GOOGLE_API_KEY`: *(Optional) your Google API key*
   - `GOOGLE_SEARCH_ENGINE_ID`: *(Optional) your Custom Search Engine ID*
6. Click **Create Web Service**.
7. Once deployment finishes, Render will give you a public URL, for example:
   ```
   https://plant-classifier-api.onrender.com
   ```
8. Verify it works by opening in your browser:
   `https://plant-classifier-api.onrender.com/health` (should return `{"status": "ok", ...}`)

---

### Option B: Quick Test via Cloudflare Tunnel / ngrok

If you want to keep running the backend on your computer and immediately deploy the frontend to Vercel:

1. In one terminal, keep your backend running:
   ```bash
   cd plant-identification-webapp/backend
   python -m uvicorn main:app --host 127.0.0.1 --port 8000
   ```
2. In another terminal, expose port 8000 using Cloudflare Tunnel or ngrok:
   ```bash
   # Using cloudflared (free, no sign-up required)
   npx cloudflared tunnel --url http://127.0.0.1:8000
   ```
   Or using ngrok:
   ```bash
   ngrok http 8000
   ```
3. Copy the generated `https://....trycloudflare.com` or `https://....ngrok-free.app` URL. That will be your backend URL!

---

## Step 3: Deploy the Frontend to Vercel

### Method 1: Using the Vercel Web Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Select your GitHub repository and click **Import**.
3. In the **Configure Project** screen:
   - **Project Name**: `medicinal-plant-identifier`
   - **Framework Preset**: Select **Vite** (Vercel will usually auto-detect this).
   - **Root Directory**: Click **Edit** and set it to:
     ```
     plant-identification-webapp/frontend
     ```
     *(This is very important so Vercel builds the React app, not the ML root!)*
   - **Build and Output Settings**:
     - Build Command: `npm run build` (or leave default)
     - Output Directory: `dist` (default)
     - Install Command: `npm install` (default)
4. Expand **Environment Variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2 (e.g. `https://plant-classifier-api.onrender.com` or your tunnel URL).
   - Click **Add**.
5. Click **Deploy**! 🚀

Vercel will now install dependencies, build the Vite app, and provide you with a live domain (e.g. `https://medicinal-plant-identifier.vercel.app`).

---

### Method 2: Using the Vercel CLI

If you prefer deploying directly from your terminal:

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate into the frontend folder:
   ```bash
   cd "plant-identification-webapp/frontend"
   ```

3. Log in to your Vercel account:
   ```bash
   vercel login
   ```

4. Link and deploy:
   ```bash
   vercel
   ```
   - When prompted:
     - `Set up and deploy?`: **Y**
     - `Which scope?`: Choose your account
     - `Link to existing project?`: **N**
     - `What's your project's name?`: `medicinal-plant-identifier`
     - `In which directory is your code located?`: `./`
     - `Want to modify these settings?`: **N**

5. Add the environment variable:
   ```bash
   vercel env add VITE_API_URL production
   # Enter value: https://your-backend-url.onrender.com
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## Step 4: Configure Environment Variables on Vercel

If you ever change your backend URL or deploy a new backend:

1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** → **Environment Variables**.
3. Check `VITE_API_URL`:
   - Value: `https://your-backend-api-url` (without a trailing slash)
4. Under **Deployments**, trigger a **Redeploy** on your latest deployment so the new environment variable is baked into the Vite build.

---

## Step 5: Testing & Verification

1. Open your live Vercel URL in your browser: `https://your-project.vercel.app`.
2. Inspect the UI:
   - Modern botanical design system with badges and clean cards.
   - Medical disclaimer at the bottom.
3. Test identification:
   - Drag and drop or browse for a leaf image (e.g., from the `test/` folder).
   - Click **Identify Plant**.
   - Confirm that:
     - The predicted plant name appears with the confidence bar.
     - Documented metadata displays (Botanical Name, Family, Parts Used, Medicinal Properties, Side Effects).
     - Reference images or Google Search link appear.

---

## 🛠️ Troubleshooting & FAQ

### Q: Why not deploy both frontend and backend on Vercel Serverless Functions?
> **Answer**: Vercel Serverless Functions have an uncompressed file size ceiling of 250 MB. PyTorch alone is ~800MB–1.2GB. Even when stripped, the PyTorch wheels exceed Vercel's limit and cause `FUNCTION_INVOCATION_TIMEOUT` or deployment bundle rejection. Hosting the backend on a dedicated container service (like Render) while hosting the UI on Vercel gives you the best speed, stability, and zero bundle size headaches.

### Q: I get a CORS error in the browser console.
> **Answer**: In `plant-identification-webapp/backend/main.py`, CORS is already enabled for all origins (`allow_origins=["*"]`). If you restrict origins in production, make sure to add your Vercel domain (`https://your-project.vercel.app`) to `allow_origins`.

### Q: The first prediction on Render takes 30-50 seconds.
> **Answer**: Free instances on Render go to sleep after 15 minutes of inactivity. When a new request arrives, it spins up ("cold start"). Paid plans or free services with continuous uptime do not experience cold starts.

### Q: My images aren't uploading / "Unsupported file type".
> **Answer**: Supported formats are JPG, JPEG, PNG, and WEBP, up to 10 MB. Check that the file extension and MIME type match these formats.

---

✨ **Your Medicinal Plant Identifier is now live on Vercel!**
