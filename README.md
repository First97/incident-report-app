# 🚨 Incident Report App

A full-stack web application for creating, viewing, editing, and deleting incident reports — built with React + TypeScript (frontend) and Go (backend).

---

## 📸 Preview

> _Add your screenshot here_

---

## ✨ Features

- 📝 **Create** incident reports with title, description, category, and status
- 📋 **View** all incidents in a sortable, searchable table
- ✏️ **Edit** any existing incident report
- 🗑️ **Delete** your own incident reports (owner-based via browser UUID)
- 🔍 **Filter** by category and status, with title search
- 📄 **Pagination** with selectable page size (5 or 10 per page)
- 📊 **Export to Excel** — exports currently filtered data as `.xlsx`

---

## 🛠️ Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React, TypeScript, Vite, Tailwind CSS   |
| Backend  | Go (Golang)                             |
| Database | PostgreSQL                     |
| Libraries | TanStack Query, React Hook Form, Zod, SheetJS (xlsx) |

---

## 📁 Project Structure

```
incident-report-app/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── IncidentForm.tsx   # Form for create/edit
│       │   └── Modal.tsx          # Reusable modal wrapper
│       ├── lib/
│       │   ├── api.ts             # API functions (fetch wrapper)
│       │   └── owner.ts           # UUID owner ID (localStorage)
│       ├── App.tsx                # Main page with table, filters, pagination
│       └── main.tsx               # React entry point
└── backend/
    └── ...                        # Go backend (router, handlers, DB)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Go >= 1.21
- PostgreSQL for local dev

---

### 1. Clone the repository

```bash
git clone https://github.com/First97/incident-report-app.git
cd incident-report-app
```

---

### 2. Backend Setup

```bash
cd backend

# Run the server
go run ./cmd/api
```

Backend runs at: `http://localhost:8080/api/incidents`

---

### 3. Frontend Setup

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

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/incidents`       | List all incidents       |
| POST   | `/api/incidents`       | Create a new incident    |
| PUT    | `/api/incidents/:id`   | Update an incident       |
| DELETE | `/api/incidents/:id`   | Delete an incident       |

---

## 🌍 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8080
```

### Backend (`.env`)

```env
PORT=8080
DATABASE_URL=./incident.db   # SQLite example
# DATABASE_URL=postgres://user:password@localhost:5432/incident_db
```

---

## 📝 License

This project was built as part of a Full-Stack Developer Intern technical assessment.

