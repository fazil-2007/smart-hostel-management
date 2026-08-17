# Smart Hostel Management System Architecture

## Overview
The Smart Hostel Management and Student Services Platform is designed using a clean 3-tier full-stack architecture tailored for university software engineering evaluation.

```
+-------------------------------------------------------------+
|                     Client Tier (Browser)                   |
|           React.js + Vite + Glassmorphism UI                |
+-------------------------------------------------------------+
                              |
                     REST APIs (JSON / JWT)
                              |
+-------------------------------------------------------------+
|                 Application Tier (Backend)                  |
|          Spring Boot 3.4 / Java 21 REST Services            |
|  Controller  <->  Service Layer  <->  JPA Repository        |
+-------------------------------------------------------------+
                              |
                     JDBC Connection
                              |
+-------------------------------------------------------------+
|                   Database Tier (Data)                      |
|                  MySQL 8.0 Relational DB                    |
|   8 Core Entities (users, rooms, allocations, etc.)        |
+-------------------------------------------------------------+
```

## Backend Layer Architecture
- **Controller Package (`com.hostel.controller`)**: Manages HTTP endpoints, handles request DTO mappings, and returns JSON payloads.
- **Service Package (`com.hostel.service`)**: Implements core business logic, room availability validation, allocation updates, and status transitions.
- **Repository Package (`com.hostel.repository`)**: Spring Data JPA repositories handling MySQL query executions.
- **Model Package (`com.hostel.model`)**: JPA Entities with clean relationships and constraints.
- **DTO Package (`com.hostel.dto`)**: Data transfer objects for authentication, dashboard metrics, and reports.
- **Security Package (`com.hostel.security`)**: JWT utility, request filtering, and role-based access control (`STUDENT`, `WARDEN`, `ADMIN`).

## Frontend Architecture
- **Auth Context (`src/context/AuthContext.jsx`)**: Manages token persistence, logged-in user state, and role guards.
- **API Service Layer (`src/services/api.js`)**: Axios REST Client configured with Bearer token authentication + automatic fallback offline demo mode for standalone assessment.
- **UI Components (`src/components/`)**: Modular navigation (`Navbar`, `Sidebar`), status cards (`StatCard`), table rendering (`DataTable`), and dialogs (`Modal`).
- **Role Pages (`src/pages/`)**: Specialized dashboards for Students, Wardens, and Admins alongside feature pages for Allocation, Occupancy, Attendance, Maintenance, Visitors, Payments, and Reports.
