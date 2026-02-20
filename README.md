# 🚨 Incident Report App

A full-stack web application for creating, viewing, editing, and deleting incident reports — built with React + TypeScript (frontend) and Go (backend).

---

## 📸 Preview

> <div align="center">
  <img width="2880" height="1644" alt="image" src="https://github.com/user-attachments/assets/7d43a10b-8c1f-4236-9f4e-be4672ca84ce" />
</div>

---

<div align="center">
  <img width="2880" height="1636" alt="image" src="https://github.com/user-attachments/assets/acbf38dd-f957-4806-8c12-265e7ca2ac38" />
</div>

---

<div align="center">
  <img width="2880" height="1636" alt="image" src="https://github.com/user-attachments/assets/4d7a5c1f-5b76-4cfe-bf62-f23c219623d8" />
</div>

---

<div align="center">
  <img width="2880" height="1640" alt="image" src="https://github.com/user-attachments/assets/0d8972ac-1e9d-4503-b1e5-c9028341676d" />
</div>

---

<div align="center">
  <img width="2880" height="1634" alt="image" src="https://github.com/user-attachments/assets/1ca73e5e-8a31-4659-982a-06b137ac236c" />
</div>

---

## ✨ Features

- 📝 **Create** incident reports with title, description, category, and status
- 📋 **View** all incidents in a searchable table
- ✏️ **Edit** any existing incident report
- 🗑️ **Delete** your own incident reports (owner-based via browser UUID)
- 🔍 **Filter** by category and status, with title search
- 📄 **Pagination** with selectable page size (5 or 10 per page)
- 📊 **Export to Excel** — exports currently filtered data as `.xlsx`

---

## 🛠️ Tech Stack

| Layer     | Technology                                                   |
| --------- | ------------------------------------------------------------ |
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS v4                  |
| Backend   | Go (Golang), Gin, pgx                                        |
| Database  | PostgreSQL 16                                                |
| Libraries | TanStack Query, React Hook Form, Zod, SheetJS (xlsx), uuid   |

---

## 📁 Project Structure

```
incident-report-app/
├── docker-compose.yml                  # PostgreSQL local dev setup
│
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go                 # Entry point, router setup, CORS
│   ├── internal/
│   │   ├── db/
│   │   │   └── db.go                   # DB connection pool + auto-migrate
│   │   ├── handlers/
│   │   │   └── incidents.go            # CRUD handlers (List, Create, Update, Delete)
│   │   ├── middleware/
│   │   │   └── owner.go                # X-Owner-Id header validation
│   │   └── models/
│   │       └── incident.go             # Incident struct + request types
│   ├── migrations/
│   │   └── create_incidents.sql        # SQL schema (reference)
│   ├── .env                            # Backend env vars
│   ├── go.mod
│   └── go.sum
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── IncidentForm.tsx         # Form for create/edit (react-hook-form + zod)
    │   │   └── Modal.tsx                # Reusable modal wrapper
    │   ├── lib/
    │   │   ├── api.ts                   # API functions (fetch wrapper)
    │   │   └── owner.ts                 # UUID owner ID (localStorage)
    │   ├── App.tsx                      # Main page: table, filters, pagination, export
    │   ├── main.tsx                     # React entry point
    │   └── index.css                    # Tailwind import
    ├── .env                             # Frontend env vars
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- Go >= 1.21
- Docker (for PostgreSQL)

---

### 1. Clone the repository

```bash
git clone https://github.com/First97/incident-report-app.git
cd incident-report-app
```

---

### 2. Start the database

```bash
docker-compose up -d
```

PostgreSQL will be available at `localhost:5432` with:
- User: `app`
- Password: `app`
- Database: `incident_app`

---

### 3. Backend Setup

```bash
cd backend

# Install dependencies
go mod tidy

# Run the server (auto-migrates DB on startup)
go run ./cmd/api
```

Backend runs at: `http://localhost:8080/api/incidents`

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint             | Auth Header    | Description           |
| ------ | -------------------- | -------------- | --------------------- |
| GET    | `/api/incidents`     | —              | List all incidents    |
| POST   | `/api/incidents`     | `X-Owner-Id`   | Create a new incident |
| PUT    | `/api/incidents/:id` | —              | Update an incident    |
| DELETE | `/api/incidents/:id` | `X-Owner-Id`   | Delete an incident    |

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

```env
PORT=8080
DATABASE_URL=postgres://app:app@localhost:5432/incident_app?sslmode=disable
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080
```

---

## 📝 License

This project was built as part of a Full-Stack Developer Intern technical assessment.
