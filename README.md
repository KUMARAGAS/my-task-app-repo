# 🚀 Task Management System (Full-Stack Assessment)

A robust, production-ready Task Management Application built for the **Koncepthive Technical Assessment**. This system features modern web architecture with JWT authentication, global state management & API data fetching using **Redux Toolkit (RTK Query)**, full task CRUD operations, dynamic search/filtering, database migrations with Prisma, and PostgreSQL containerization via Docker.

---

## 🏗️ Tech Stack & Architecture

This repository is structured as a **Monorepo** containing both Frontend and Backend projects.

### 🌐 Frontend (`/Koncepthive (Pvt) Ltd.FE`)
* **Framework:** React.js (Vite)
* **State Management & API Fetching:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux`) for Global State Management and API Integration.
* **Styling:** Tailwind CSS / Modern UI Component Library (Shadcn UI)

### ⚙️ Backend (`/Koncepthive (Pvt) Ltd.BE`)
* **Runtime:** Node.js (Express.js)
* **Language:** TypeScript
* **Database & ORM:** PostgreSQL + Prisma ORM
* **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing

### 🐳 DevOps & Environment
* **Containerization:** Docker Compose (PostgreSQL Database)
* **Configuration:** `.env.example` templates provided for both FE and BE

---

## 📂 Repository Structure

```text
├── Koncepthive (Pvt) Ltd.FE/    # React + Redux Frontend Client
│   ├── src/
│   │   ├── store/              # Redux Store Configuration, Slices & API Services
│   │   ├── components/
│   │   └── pages/
│   ├── .env.example
│   └── package.json
├── Koncepthive (Pvt) Ltd.BE/    # Express + Prisma Backend Server
│   ├── prisma/
│   │   ├── migrations/          # Database Migration Files
│   │   └── schema.prisma        # Database Schema Definition
│   ├── src/
│   ├── .env.example
│   └── package.json
├── docker-compose.yml           # PostgreSQL Docker Service Configuration
└── README.md                    # Project Documentation
```

---

## ⚡ Quick Start & Setup Guide

Follow these steps to set up and run the application on your local machine.

### 1️⃣ Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (For running PostgreSQL container)
* [Git](https://git-scm.com/)

---

### 2️⃣ Database Setup (Docker)

Start the PostgreSQL database service from the **Root Directory**:

```bash
docker-compose up -d
```
*PostgreSQL will run locally on port `5432`.*

---

### 3️⃣ Backend Setup (`Koncepthive (Pvt) Ltd.BE`)

1. **Navigate to Backend directory:**
   ```bash
   cd "Koncepthive (Pvt) Ltd.BE"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   *Backend runs on `http://localhost:8000` (or configured PORT).*

---

### 4️⃣ Frontend Setup (`Koncepthive (Pvt) Ltd.FE`)

1. **Open a new terminal and navigate to Frontend directory:**
   ```bash
   cd "Koncepthive (Pvt) Ltd.FE"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Start Frontend Client:**
   ```bash
   npm run dev
   ```
   *Frontend application will run on `http://localhost:5173`.*

---

## 🔐 Test Credentials

You can test the application using the following test account or create a new user via the Sign-Up page:

* **Email:** `admin@test.com`
* **Password:** `123456`

---

## ✨ Features Implemented

- [x] **User Authentication:** JWT-based Login, Sign Up, Protected Routes.
- [x] **Global State & API Handling:** Redux Toolkit used for managing Application State and executing API requests seamlessly.
- [x] **Dashboard:** Task summaries, overview, and statistics.
- [x] **Task Management (CRUD):** Full Create, Read, Update, Delete capabilities.
- [x] **Search & Filtering:** Real-time search and status/priority filtering.
- [x] **Database Migrations:** Structured DB Schema via Prisma ORM.
- [x] **Docker Integration:** Easy Postgres setup via `docker-compose`.

# my-task-app-repo
