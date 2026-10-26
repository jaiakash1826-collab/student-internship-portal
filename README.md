# Student Internship Portal (MERN Stack)

A full-stack web application built with MongoDB, Express, React, and Node.js for managing and submitting student internship applications.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [API Endpoints](#api-endpoints)
- [Deployment Guide](#deployment-guide)
  - [Backend on Render](#backend-on-render)
  - [Frontend on Vercel](#frontend-on-vercel)
- [Verification & Screenshots](#verification--screenshots)

---

## Overview

The Student Internship Portal provides a seamless workflow for students to discover verified tech internship opportunities and apply online:
1. **Internship Directory**: Explore curated roles with clear details on compensation, duration, location, and required technical skills.
2. **Detailed Position View**: Dedicated route (`/internships/:id`) detailing job specifications and responsibilities.
3. **Application Submission**: Validated application form capturing student name, email, roll number, and selected internship.
4. **MongoDB Persistence**: Mongoose schema and async REST API storing submissions with timestamps and returning unique IDs.
5. **Submitted Applications Tracker**: Real-time review page (`/applications`) fetching records sorted newest first.

---

## Project Structure

```
my-project/
├── .vscode/                     # VS Code workspace settings
├── src/
│   ├── routes/
│   │   └── index.js             # Express API routes
│   └── models/
│       └── Application.js       # Mongoose Application schema
├── client/                      # React frontend (Vite)
│   ├── public/                  # Public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── InternshipCard.jsx
│   │   │   └── ApplicationForm.jsx
│   │   ├── pages/
│   │   │   ├── InternshipList.jsx
│   │   │   ├── InternshipDetails.jsx
│   │   │   └── Applications.jsx
│   │   ├── api.js               # Centralized API fetch layer
│   │   ├── App.jsx              # App layout and route definitions
│   │   ├── App.css              # Application design styles
│   │   ├── index.css            # Base accessibility and resets
│   │   └── main.jsx             # React entry point with BrowserRouter
│   ├── index.html
│   ├── vite.config.js           # Vite config with dev proxy
│   ├── vercel.json              # SPA routing rewrite rule
│   ├── package.json
│   └── package-lock.json
├── app.js                       # Express server and DB initialization
├── package.json                 # Backend dependencies & scripts
├── package-lock.json
├── .env                         # Local secrets (never committed)
├── .env.example                 # Environment template
├── .gitignore                   # Ignore rules
├── Dockerfile                   # Multi-stage production container
└── README.md
```

---

## Prerequisites

- Node.js >= 18.x (Node 20+ recommended)
- npm >= 9.x
- MongoDB connection URI

---

## Environment Configuration

Create a `.env` file at the root directory based on `.env.example`:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Allowed CORS origins (comma-separated, no trailing slash)
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173,https://internship-portal-khaki.vercel.app

# Complete MongoDB connection URI
MONGO_DB_URI=mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>
```

> **Security Note:** Never commit `.env` files or expose database credentials in repository commits or client-side code.

---

## Local Development

### 1. Install Dependencies
```bash
# Install root (backend) dependencies
npm install

# Install client (frontend) dependencies
npm --prefix client install
```

### 2. Start Servers

You can run both backend and frontend concurrently:
```bash
npm run dev:all
```

Or run them individually in separate terminal sessions:
```bash
# Terminal 1: Start Express backend with nodemon
npm run dev

# Terminal 2: Start Vite React frontend
npm run client
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 3. Build & Lint Frontend
```bash
# Run ESLint on client code
npm --prefix client run lint

# Production build
npm --prefix client run build
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and database connection state |
| `GET` | `/api/health` | Healthcheck (HTTP 200 when DB connected, 503 otherwise) |
| `GET` | `/api/internships` | List all available internship postings |
| `GET` | `/api/internships/:id` | Fetch specific internship details by ID |
| `POST` | `/api/applications` | Submit application (`studentName`, `email`, `rollNumber`, `internshipId`) |
| `GET` | `/api/applications` | List all submitted applications (sorted newest first) |

### Sample POST `/api/applications` Request:
```json
{
  "studentName": "Jane Doe",
  "email": "jane.doe@example.com",
  "rollNumber": "21CS042",
  "internshipId": "frontend-developer"
}
```

---

## Deployment Guide

### Backend on Render

- **Repository**: `https://github.com/jaiakash1826-collab/student-internship-portal`
- **Branch**: `main`
- **Root Directory**: `.` (leave empty / repository root)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_DB_URI`: `<Your MongoDB Connection URI>`
  - `FRONTEND_URL`: `https://internship-portal-khaki.vercel.app`
  - `NODE_ENV`: `production`

### Frontend on Vercel

- **Repository**: `https://github.com/jaiakash1826-collab/student-internship-portal`
- **Branch**: `main`
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://internship-portal-rr66.onrender.com` (do not append `/api` or trailing slashes)

---

## Verification & Screenshots

To capture screenshots for ByteXL submission:
1. **Application Submission**: Open the internship details page for any role (e.g. `Frontend Developer Intern`), fill out the form, click **Submit Application**, and capture the green confirmation banner with the generated Application Reference ID.
2. **Application Retrieval**: Navigate to the **Applications** page (`/applications`), verify your submitted record is visible in the table with student name, email, roll number, role title, and timestamp, and take a screenshot.
