# Classma Project — Education Admin Dashboard

A full-stack admin dashboard for academic resources (departments, subjects, classes, users, enrollments) built with Refine on the frontend and Express + Drizzle ORM on the backend, using Better Auth for authentication and Neon/Postgres for persistence.

## Project Overview

This repository contains a production-oriented example of an admin platform tailored for academic management. It demonstrates an end-to-end stack with authentication, role management (student / teacher / admin), server-side pagination and filtering, and a typed database schema using Drizzle.

Who it's for
- Developers building internal admin panels or education-focused platforms.
- Teams wanting a realistic example of integrating Refine, Better Auth and Drizzle/Neon.

What it solves
- Provides a complete reference for authentication, data modelling, REST endpoints, and an admin UI to manage educational resources.

---

## Features

- Refine-based React admin frontend with pages for departments, subjects, classes, users and enrollments.
- Email/password sign-up and sign-in with `better-auth` and provider support.
- Role-aware user profiles with `role` and optional `imageCldPubId` fields.
- Drizzle ORM schema, Neon HTTP driver, and drizzle-kit migrations for PostgreSQL-compatible databases.
- Server endpoints for departments, subjects, classes, enrollments and stats.
- Example Cloudinary integration for image uploads (frontend-ready).
- Basic production-minded error mapping (e.g., unique-email -> 409).

---

## Tech Stack

- Frontend: React 19, TypeScript, Refine, Vite, Tailwind CSS, Radix UI
- Backend: Node (TypeScript), Express 5, Better Auth, Drizzle ORM, Neon (Postgres driver)
- Database: PostgreSQL-compatible (Neon recommended)
- Dev tools: tsx (dev runner), drizzle-kit (migrations), eslint, TypeScript

---

## Repository Layout

- `/frontend` — React + Refine app (Vite). Pages, components, providers (`authClient`), and constants.
- `/backend` — Express server (TypeScript). Routes, Better Auth integration, Drizzle schema and DB initialization.
- `/backend/src/db` — Drizzle schema files and DB exports.
- `/backend/src/routes` — REST endpoints for resources.

---

## Installation & Local Setup

Prerequisites:
- Node.js 18+ and npm (or yarn)
- A PostgreSQL-compatible database (Neon is supported)

1. Clone the repository

```bash
git clone <repo-url>
cd refine-project
```

2. Backend setup

```bash
cd backend
npm install

# Copy example env and fill values
cp .env.example .env
# Edit .env and set DATABASE_URL, FRONTEND_URL and BETTER_AUTH_SECRET
```

backend/.env example

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
FRONTEND_URL=http://localhost:5173
BETTER_AUTH_SECRET=your_long_secret_here
NODE_ENV=development
```

3. Frontend setup

```bash
cd ../frontend
npm install

# Copy example env and fill values
cp .env.example .env
# Edit VITE_BACKEND_BASE_URL and Cloudinary settings if needed
```

frontend/.env example

```env
VITE_BACKEND_BASE_URL=http://localhost:8000/api/
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/<cloud_name>/auto/upload
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

4. Database migrations

```bash
# from backend/
npm run db:migrate
```

5. Run in development

```bash
# Backend (tsx watch)
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

The frontend expects `VITE_BACKEND_BASE_URL` to point to the backend API and to end with `/api/`.

---

## Usage

- Open the frontend dev server (usually `http://localhost:5173`) and register or sign in.
- Use the admin UI to create departments, add subjects and classes, assign teachers, and enroll students.
- Use the Inspect/Network devtools to troubleshoot API calls.

---

## Configuration

- `backend/.env`
  - `DATABASE_URL` — PostgreSQL connection string (Neon supported)
  - `FRONTEND_URL` — frontend origin for CORS and auth trusted origins
  - `BETTER_AUTH_SECRET` — secret used by Better Auth

- `frontend/.env` (Vite)
  - `VITE_BACKEND_BASE_URL` — API base URL (must end with `/api/`)
  - `VITE_CLOUDINARY_*` — Cloudinary upload settings if using image uploads

---

## Troubleshooting

- Duplicate email on sign-up: the backend maps unique email constraint violations to a 409 response. If you see DB errors, ensure you are not retrying the same request and that the email is unique.
- Telemetry script blocked in browser: harmless (ad/telemetry script blocked by adblocker).
- If endpoints return 400, verify parameter types (e.g., department id should be numeric).

---

## Roadmap

- Add comprehensive unit and integration tests for backend and frontend.
- Implement server-side RBAC enforcement and scopes for endpoints.
- Add Cloudinary signed upload flow for secure image uploads.
- Add CI/CD pipeline for build, tests and deployment.

---

## Portfolio Statement

This project was created for portfolio purposes. You are free to explore, learn from, and reuse it.

---

## Contact Information

Email: skop.systems@gmail.com  
Website: https://skop.vercel.app  
Phone: +252638561209

---

## License

This project is provided under the MIT License. See `LICENSE` for details.
