# Smart Hostel Management and Student Services Platform

A full-stack web application developed for university Software Engineering course assessment. The system streamlines hostel administration, room allocation, occupancy tracking, attendance monitoring, maintenance requests, visitor logs, and fee collection.

---

## 📌 Problem Statement & Objectives

### Problem Statement
Universities managing multiple hostels struggle with room allocation, occupancy tracking, maintenance requests, attendance, visitor management, and fee collection. Manual processes increase administrative workload and reduce operational efficiency.

### Objectives
1. **Manage Room Allocation**: Dynamically assign and vacate rooms based on capacity.
2. **Track Occupancy**: Real-time room occupancy metrics and vacancy rates.
3. **Process Maintenance Requests**: Categorized ticket submission and resolution tracking.
4. **Monitor Attendance**: Track daily student curfew compliance and night logs.
5. **Generate Administrative Reports**: Aggregate system summary for university leadership.

### Expected Outcomes
- Efficient hostel administration
- Improved student services
- Reduced paperwork
- Better facility utilization

---

## 🛠 Technology Stack

- **Frontend**: React.js 18, Vite, Lucide Icons, Glassmorphism CSS Design System
- **Backend**: Spring Boot 3.4, Java 21, Spring Data JPA, Spring Security (JWT)
- **Database**: MySQL 8.0
- **API**: RESTful Web Services
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

---

## 📂 Project Structure

```
smart-hostel-management/
├── frontend/                 # React.js SPA (Vite, Glassmorphism UI, Axios)
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, StatCard, DataTable, Modal
│   │   ├── context/          # AuthContext with JWT & role state
│   │   ├── pages/            # 11 Dedicated Pages (Dashboards & Modules)
│   │   └── services/         # REST API Service Client + Standalone Mock Mode
│   └── Dockerfile
├── backend/                  # Spring Boot (Java 21) REST Backend
│   ├── src/main/java/com/hostel/
│   │   ├── controller/       # REST API Controllers (including /api/health)
│   │   ├── service/          # Business logic services
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   ├── model/            # Entities (User, Student, Room, Allocation, etc.)
│   │   ├── dto/              # Data Transfer Objects
│   │   └── security/         # JWT Utils & Security Configuration
│   └── Dockerfile
├── database/
│   ├── schema.sql            # DDL MySQL tables creation
│   └── seed.sql              # Initial sample data for demonstration
├── docs/                     # Architecture & REST API Documentation
│   ├── architecture.md
│   └── api-docs.md
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── .gitignore                # Git ignore rule definitions
├── README.md                 # Complete project guide
└── docker-compose.yml        # Docker Compose configuration (Frontend + Backend + MySQL)
```

---

## 🔑 Pre-seeded Demo User Credentials

For university demonstration, the application comes with pre-configured accounts:

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Full system access, room inventory, master metrics |
| **WARDEN** | `warden1` | `warden123` | Operational oversight, visitor logs, attendance tracking |
| **STUDENT** | `student1` | `student123` | Student dashboard, maintenance requests, fee status |

---

## 🚀 Running the Project

### Option A: Running with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running.
2. Build and start all services in the background:
   ```bash
   docker-compose up --build -d
   ```
3. Access the web applications:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
   - **Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)
4. To stop services:
   ```bash
   docker-compose down
   ```

### Option B: Running Locally (Development Mode)

#### 1. Database Setup
Create MySQL database and run script files:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

#### 2. Backend Setup (Java 21 & Maven)
```bash
cd backend
mvn clean spring-boot:run
```

#### 3. Frontend Setup (Node.js & React)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Health-Check & API Verification

You can verify that the backend application is running properly using `curl` or opening the link in your browser:

```bash
curl http://localhost:8080/api/health
```

Expected JSON response:
```json
{
  "service": "Smart Hostel Management Platform API",
  "version": "1.0.0",
  "status": "UP",
  "timestamp": "2026-08-17T14:15:00"
}
```

---

## 📝 Git History Assessment Guide

Per assignment guidelines, automated git commits were disabled. You can commit your project files in logical steps to build your commit history for evaluation:

```bash
# Step 1: Commit database schema and seed data
git add database/
git commit -m "feat(database): add MySQL schema DDL and seed data"

# Step 2: Commit Spring Boot backend application
git add backend/
git commit -m "feat(backend): implement Spring Boot Java 21 REST API with JWT security"

# Step 3: Commit React frontend application
git add frontend/
git commit -m "feat(frontend): implement React glassmorphism UI and role dashboards"

# Step 4: Commit Docker & project documentation
git add docker-compose.yml .env.example .gitignore README.md docs/
git commit -m "docs & infra: add docker-compose orchestration and project documentation"
```
