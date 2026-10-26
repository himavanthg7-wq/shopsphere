# 🚀 Complete Guide: Deploying ShopSphere to Render

This step-by-step guide covers how to deploy the **ShopSphere Full-Stack E-Commerce System** to [Render](https://render.com).

---

## 🏗️ Architecture on Render

| Layer | Service Type on Render | Details |
| :--- | :--- | :--- |
| **Frontend** | **Static Site** (Free) | React 18 + Vite SPA, auto-built with `npm run build`, served globally via CDN with SPA rewrite rules. |
| **Backend** | **Web Service** (Free, Docker) | Spring Boot 3 + Java 22 running in a lightweight container with automated health checks. |
| **Database** | **Render Managed PostgreSQL** (Free) | *Provisioned automatically by Render via Blueprint.* Zero external signups required. (Also supports external Cloud MySQL if desired). |

---

## ⚡ Automated 1-Click Deployment (Zero Manual Database Setup!)

Because we added dual MySQL + PostgreSQL support and automated database provisioning in `render.yaml`, **you no longer need to manually create an external database account**:

Render will automatically provision the database, inject credentials into the backend, and Spring Boot's Hibernate + `DataInitializer` will automatically create all tables, default roles, and seed demo users upon startup!

---

## 📦 Step 2: Push the Code to GitHub

Render builds directly from a GitHub repository.

1. Open PowerShell and navigate to the `ShopSphere` folder:
   ```powershell
   cd C:\Users\USER\Desktop\internshipproj\ShopSphere
   ```
2. Initialize and commit:
   ```powershell
   git init
   git add .
   git commit -m "Setup ShopSphere for Render deployment"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `shopsphere`.
4. Link and push:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/shopsphere.git
   git push -u origin main
   ```

---

## ⚡ Step 3: Deploy on Render

### Option A: Using the Render Blueprint (Fastest – 1 Click)

We have already included a `render.yaml` configuration in the project.

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Select your `shopsphere` GitHub repository.
4. Render will detect `render.yaml` and prompt you for the database environment variables:
   - `SPRING_DATASOURCE_URL`: Paste the cloud MySQL JDBC URL from Step 1.
   - `SPRING_DATASOURCE_USERNAME`: Paste your cloud MySQL username.
   - `SPRING_DATASOURCE_PASSWORD`: Paste your cloud MySQL password.
5. Click **Apply**.
6. Render will automatically build the backend Docker container and compile the frontend static site!

---

### Option B: Manual Setup via Render Dashboard

If you prefer to configure the services manually:

#### 1. Deploy the Backend Web Service:
1. Click **New +** > **Web Service**.
2. Connect your `shopsphere` repository.
3. Configure the following settings:
   - **Name**: `shopsphere-backend`
   - **Region**: Oregon (or your preferred region)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   | Variable | Value |
   | :--- | :--- |
   | `PORT` | `8080` |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/<DB>?useSSL=true&serverTimezone=UTC...` |
   | `SPRING_DATASOURCE_USERNAME` | `<YOUR_DB_USER>` |
   | `SPRING_DATASOURCE_PASSWORD` | `<YOUR_DB_PASSWORD>` |
   | `JWT_SECRET` | `9a7c8e5f3b2d1a4c6e8f0b2d4f6a8c0e2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a` |
   | `RAZORPAY_KEY_ID` | `rzp_test_shopsphere_mock_id` |
   | `RAZORPAY_KEY_SECRET` | `rzp_test_shopsphere_mock_secret` |
5. Click **Create Web Service**. Wait for the deployment to finish, then copy your backend URL:
   `https://shopsphere-backend-xxxx.onrender.com`

---

#### 2. Deploy the Frontend Static Site:
1. Click **New +** > **Static Site**.
2. Connect the same `shopsphere` repository.
3. Configure the following settings:
   - **Name**: `shopsphere-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects / Rewrites**, add an SPA rewrite rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Under **Environment Variables**, add:
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://shopsphere-backend-xxxx.onrender.com/api` |
   *(Replace with your actual backend URL from the previous step!)*
6. Click **Create Static Site**.

---

## 🎯 Step 4: Verify Deployment & Test

1. Once the frontend deployment shows **Live**, open your frontend URL:
   `https://shopsphere-frontend-xxxx.onrender.com`
2. Test by logging in with either demo account:
   - **Customer**: `customer@shopsphere.com` / `Customer@123`
   - **Admin**: `admin@shopsphere.com` / `Admin@123`
3. Browse products, add to cart, apply coupon `WELCOME10`, and test the checkout flow!

> [!NOTE]
> Render Free Tier services spin down after 15 minutes of inactivity. When you open the frontend after inactivity, the first API request to the backend may take 30–50 seconds while the free instance boots up. Subsequent requests respond instantly.
