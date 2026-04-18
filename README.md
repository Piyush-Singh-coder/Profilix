# 🚀 Profilix — Your Code, Your Career, One Link.

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge)](https://profilix.vercel.app)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/Piyush-Singh-coder/Profilix)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Profilix** is a premium, all-in-one platform designed for developers and tech professionals to showcase their careers. From AI-tailored resumes to high-performance portfolio cards, Profilix bridges the gap between your code and your professional identity.

---

## ✨ Key Features

### 📑 AI-Powered Resume Generator
- **ATS-Friendly Mode:** Clean, single-column layouts optimized for automated software screeners. Supports **PDF** and **DOCX**.
- **Premium Design Mode:** Elegant 2-column layouts that dynamically follow your active profile theme (Glass, Neon, Skeuomorphic, etc.).
- **AI Tailoring:** Provide a job description, and our integration with **NVIDIA NIM** will automatically refine your experience bullet points to match the role.

### 🎴 Dynamic Portfolio Cards
- **Thematic Variety:** Showcase your profile with premium themes including **Glassmorphism**, **Neobrutalism**, **Apple**, **Aurora**, **Neon**, and more.
- **Instant Sharing:** Generate beautiful, downloadable cards for social media or networking.
- **QR Code Integration:** Every profile gets a unique QR code for instant physical-to-digital sharing.

### 🌐 Personal Branding
- **Custom Profile URL:** Your professional home at `profilix.com/u/yourname`.
- **Tech Stack Visualization:** Display your skills with high-quality, themed icons.
- **SEO Optimized:** Built with Next.js metadata and SSR to ensure your profile ranks high on search engines.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + Vanilla CSS for dynamic themes
- **State Management:** Zustand
- **Icons:** Lucide React + SimpleIcons
- **Image Optimization:** ImageKit.io + Custom Loaders

### Backend
- **Framework:** Node.js (Express)
- **Language:** TypeScript
- **Database:** PostgreSQL (via **Neon DB**)
- **ORM:** Prisma
- **PDF/Doc Generation:** Puppeteer-core + @sparticuz/chromium & docx
- **AI Engine:** NVIDIA NIM (Llama 3 / Mistral)
- **Auth:** Firebase Admin SDK (Google & GitHub OAuth)
- **Storage:** Cloudinary

---

## 📂 Project Structure

```text
.
├── frontend/               # Next.js frontend application
│   ├── src/app/           # App router pages & layouts
│   ├── src/components/    # UI components (Atomic design)
│   ├── src/store/         # Zustand state management
│   └── src/types/         # Global TS definitions
├── backend/                # Express.js backend API
│   ├── src/controllers/   # Request handlers
│   ├── src/services/      # Business logic (AI, PDF, Resume)
│   ├── src/routes/        # API route definitions
│   └── prisma/            # Database schema & migrations
├── render.yaml             # Render deployment configuration
└── README.md               # You are here!
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or Neon DB account)
- Firebase Admin details
- Cloudinary credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Piyush-Singh-coder/Profilix.git
   cd Profilix
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create .env and add your variables (see Environment Variables section)
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Create .env and add your variables
   npm run dev
   ```

---

## 📄 Environment Variables

### Backend (`/backend/.env`)
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: Secret for signing tokens.
- `FIREBASE_*`: Service account credentials.
- `CLOUDINARY_*`: Cloudinary API keys.
- `NVIDIA_API_KEY`: For AI resume features.
- `FRONTEND_URL`: URL of your frontend (for CORS).

### Frontend (`/frontend/.env`)
- `NEXT_PUBLIC_API_URL`: Backend API URL.
- `NEXT_PUBLIC_IMAGEKIT_URL`: Your ImageKit endpoint.

---

## 🚢 Deployment

### Backend (Render)
The project includes a `render.yaml` and `backend/build.sh` optimized for **Render's Free Tier**.
- **Build Command:** `bash build.sh`
- **Start Command:** `node dist/server.js`

### Frontend (Vercel)
Seamlessly deploy the `frontend` directory to **Vercel**.
- **Root Directory:** `frontend`
- **Framework:** Next.js

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by Piyush Singh</p>
