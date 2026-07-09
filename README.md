# 🎓 AI-Powered Student Course Allocation System

An AI-powered web application that automates student course allocation based on **student marks, reservation category, seat availability, and course preferences**. The system also provides an AI Assistant for answering allocation-related queries and an analytics dashboard for monitoring the allocation process.

---

# 🚀 Features

- Student Management (Add, Update, Delete, Search)
- Course Management with Category-wise Seat Distribution
- Student Preference Selection (Priority 1, 2, 3)
- Automatic Course Allocation
- Reservation Category Support (General, OBC, SC, ST)
- AI Assistant for User Queries
- Interactive Dashboard
- Course Statistics
- Category-wise Allocation
- Seat Utilization Report
- Rejection Rate Analysis
- Available Seat Tracking
- First Preference Success Rate

---

# 🛠️ Technology Stack

## Frontend

- React.js
- TypeScript
- Material UI
- Axios
- Recharts

## Backend

- FastAPI
- SQLAlchemy
- Pydantic

## Database

- PostgreSQL

## AI Integration

- OpenAI API

---

# 📂 Project Structure

```
AI-POWERED-STUDENT-COURSE-ALLOCATION-SYSTEM

│
├── backend
│   ├── app
│   │   ├── models
│   │   ├── routers
│   │   ├── schemas
│   │   ├── services
│   │   ├── database.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.tsx
│   │
│   └── package.json
│
└── README.md
```

---

# 🗄️ Database Schema

## Students

| Column | Type |
|---------|------|
| id | Integer (PK) |
| student_id | Varchar |
| name | Varchar |
| marks | Float |
| category | Varchar |
| application_date | Timestamp |

---

## Courses

| Column | Type |
|---------|------|
| id | Integer (PK) |
| course_name | Varchar |
| total_seats | Integer |
| general_seats | Integer |
| obc_seats | Integer |
| sc_seats | Integer |
| st_seats | Integer |

---

## Preferences

| Column | Type |
|---------|------|
| id | Integer (PK) |
| student_id | Integer (FK) |
| course_id | Integer (FK) |
| priority | Integer |

---

## Allocations

| Column | Type |
|---------|------|
| id | Integer (PK) |
| student_id | Integer (FK) |
| course_id | Integer (FK) |
| allocated_priority | Integer |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Rakiniya/AI-POWERED-STUDENT-COURSE-ALLOCATION-SYSTEM.git
```

---

# Backend Setup

```bash
cd backend
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run Application

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 📡 API Endpoints

## Students

| Method | Endpoint |
|----------|----------------|
| GET | /students |
| POST | /students |
| PUT | /students/{id} |
| DELETE | /students/{id} |

---

## Courses

| Method | Endpoint |
|----------|----------------|
| GET | /courses |
| POST | /courses |
| PUT | /courses/{id} |
| DELETE | /courses/{id} |

---

## Preferences

| Method | Endpoint |
|----------|----------------|
| GET | /preferences |
| POST | /preferences |

---

## Allocation

| Method | Endpoint |
|----------|----------------|
| POST | /allocation |

---

## Dashboard

| Endpoint |
|-----------|
| /dashboard/summary |
| /dashboard/course-statistics |
| /dashboard/category-summary |
| /dashboard/seat-utilization |
| /dashboard/rejection-rate |
| /dashboard/available-seats |
| /dashboard/first-preference |

---

## AI Assistant

| Method | Endpoint |
|----------|-------------|
| POST | /ai/chat |

---

# 📊 Dashboard Analytics

The dashboard provides real-time analytics including:

- Total Students
- Total Courses
- Allocated Students
- Unallocated Students
- Allocation Percentage
- First Preference Success Rate
- Course Allocation Statistics
- Category-wise Allocation
- Seat Utilization
- Rejection Rate
- Available Seats

---

# 🤖 AI Assistant

The project integrates the OpenAI API to provide an AI-powered assistant that helps users by answering questions related to:

- Course allocation
- Seat availability
- Admission process
- Reservation categories
- Dashboard insights

---

# 🔒 Security Features

- Input validation using Pydantic
- SQLAlchemy ORM to prevent SQL Injection
- Duplicate student validation
- Duplicate course validation
- Preference validation
- Foreign key validation
- Proper HTTP exception handling

---

# 🧠 Allocation Logic

The allocation process follows these steps:

1. Students are sorted by marks in descending order.
2. Student preferences are checked in priority order (Priority 1 → Priority 2 → Priority 3).
3. Seat availability is verified for the student's reservation category.
4. If a seat is available, the student is allocated to that course.
5. Allocation details are stored in the Allocations table.
6. Remaining seat counts are updated.

---

# 📈 Sample Dataset

### Students

| Student | Marks | Category |
|-----------|-------|----------|
| Pavi | 93 | ST |
| Ram | 74 | OBC |
| Kavitha | 85 | ST |

### Courses

| Course | Total Seats |
|----------|------------|
| CSE | 40 |
| AI | 60 |

### Preferences

| Student | Course | Priority |
|-----------|----------|----------|
| Pavi | AI | 1 |
| Pavi | CSE | 3 |
| Kavitha | AI | 2 |

---

# 🏗️ Architecture

```
React + TypeScript
        │
        │ REST API (Axios)
        ▼
FastAPI Backend
        │
        │ SQLAlchemy ORM
        ▼
PostgreSQL Database
        │
        ▼
OpenAI API (AI Assistant)
```

---

# 🚀 Future Enhancements

- Authentication & Authorization
- Email Notifications
- PDF Allocation Reports
- CSV/Excel Import & Export
- Admin Dashboard
- Student Login Portal
- AI-based Recommendation System
- Docker Deployment
- Cloud Hosting

---

# 👩‍💻 Author

**Rakiniya K**

GitHub:
https://github.com/Rakiniya

Project Repository:
https://github.com/Rakiniya/AI-POWERED-STUDENT-COURSE-ALLOCATION-SYSTEM

---

# 📄 License

This project is developed for educational and learning purposes.
