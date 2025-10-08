# 🗓️ ScheduleHQ SaaS
 
A full-stack scheduling application built with **React (Vite)**, **Node.js**, **Express**, **TypeScript**, and **PostgreSQL (via Prisma ORM)**.  
The project is structured with separate **frontend** and **backend** folders, and supports running both locally or inside Docker containers.
 
---
 
## 📁 Project Structure
 
```
ScheduleHQ-Saas/
│
├── frontend/         # React (Vite) frontend
│   ├── src/
│   └── package.json
│
├── backend/          # Node.js + Express + Prisma backend
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```
 
---
 
## 🚀 Getting Started
 
### 1️⃣ Clone the repository
 
```bash
git clone https://github.com/TechDweep-ScheduleHQ/schedulehq.git
cd schedulehq
```
---
 
### 1️⃣ Add ENV files
 
Create a PostgreSQL database locally (you can use pgAdmin or CLI).
 
Update your **backend/.env** file with your DB URL:
 
```
PORT=5000
DATABASE_URL="postgresql://postgres:postgres%40123@localhost:5432/ScheduleHQ-Saas?schema=public"
```
Update your **frontend/.env** file with your DB URL:
---
 
## 🐳 Run with Docker (Recommended)
 
Make sure you have **Docker Desktop** running.
 
### 1️⃣ Build and start containers
 
```bash
docker compose up --build
```
 
This will start:
- 🐘 PostgreSQL  
- ⚙️ Backend (Node.js + Express + Prisma)  
- 💻 Frontend (React + Vite)
 
---
 
### 2️⃣ Apply Prisma Migrations
 
After containers are up, open a shell inside the backend container:
 
```bash
docker compose exec backend sh
```
 
Then run:
 
```bash
npx prisma migrate dev --name init
```
 
> This will create your database schema inside the PostgreSQL container.
 
---
 
### 3️⃣ Open Prisma Studio (optional)
 
Inside the same backend container shell:
 
```bash
npx prisma studio
```
 
Then visit 👉 **http://localhost:5555**
 
---
 
### 4️⃣ Access the app
 
- **Frontend (Vite):** http://localhost:5173  
- **Backend (API):** http://localhost:5000  
 
---
 
## 💻 Run Without Docker
 
If you want to run locally (without Docker):
 
 
### 1️⃣ Install dependencies
 
**Backend**
 
```bash
cd backend
npm install
```
 
**Frontend**
 
```bash
cd ../frontend
npm install
```
 
---
 
### 2️⃣ Run Prisma migrations
 
```bash
cd ../backend
npx prisma migrate dev --name init
```
 
---
 
### 3️⃣ Start the apps
 
**Backend**
 
```bash
npm run dev
```
 
**Frontend**
 
```bash
cd ../frontend
npm run dev
```
 
---
 
### 4️⃣ Prisma Studio (optional)
 
```bash
cd backend
npx prisma studio
```
 
Then open **http://localhost:5555**
 
---
 
## 🧠 Useful Commands
 
| Purpose | Docker Command | Local Command |
|----------|----------------|----------------|
| 🏗️ Start all services | `docker compose up --build` | N/A |
| ⛔ Stop all services | `docker compose down` | N/A |
| 🐚 Enter backend shell | `docker compose exec backend sh` | N/A |
| 🧩 Run Prisma migrations | `npx prisma migrate dev --name init` (inside backend container) | `npx prisma migrate dev --name init` |
| 🧭 Open Prisma Studio | `npx prisma studio` (inside backend container) | `npx prisma studio` |
| ⚙️ Run backend | N/A | `cd backend && npm run dev` |
| 💻 Run frontend | N/A | `cd frontend && npm run dev` |
 
---
 
## 🧩 Tech Stack
 
**Frontend**
- ⚛️ React (Vite)
- 🧩 TypeScript
- 🎨 Tailwind CSS
 
**Backend**
- 🟩 Node.js / Express
- 🧠 TypeScript
- 🧱 Prisma ORM
- 🐘 PostgreSQL
 
**Dev Tools**
- 🐳 Docker & Docker Compose
- 🧰 Prisma Studio (Database GUI)
 
---
 
## 🏁 Summary
 
- 🐳 **Docker setup** provides a complete, containerized development environment (DB + Backend + Frontend).  
- 💻 **Local setup** is great for quick debugging or direct development.  
- 🧠 **Prisma Studio** gives you a visual interface to explore and edit your database at **http://localhost:5555**.
 
<!-- ---
 
🧑‍💻 **Author:** Your Name  
📧 *Optional: your email or GitHub link* -->
 
Working with push protection from the command line - GitHub Docs
Learn your options for unblocking your push from the command line to GitHub if secret scanning detects a secret in your changes.