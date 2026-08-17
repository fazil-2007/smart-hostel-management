# Smart Hostel Management REST API Reference

All APIs return standard JSON responses and expect Content-Type `application/json`.

## Health Check
- `GET /api/health`: Returns system operational status and timestamp.

## Authentication
- `POST /api/auth/login`: Accepts `{ username, password }`. Returns JWT token, user info, and role.

## Student Management
- `GET /api/students`: Get all registered students.
- `GET /api/students/{id}`: Get student by ID.
- `GET /api/students/user/{userId}`: Get student profile linked to user account.
- `POST /api/students`: Register a new student.

## Room & Occupancy Management
- `GET /api/rooms`: List all rooms with current occupancy.
- `GET /api/rooms/available`: List rooms with available capacity.
- `GET /api/rooms/occupancy`: Get occupancy statistics and percentages.
- `POST /api/rooms`: Create or update a room.

## Room Allocations
- `GET /api/allocations`: List all allocation records.
- `POST /api/allocations`: Allocate a room (`{ studentId, roomId }`).
- `PUT /api/allocations/{id}/vacate`: Mark room allocation as vacated.

## Attendance Monitoring
- `GET /api/attendance`: List attendance records.
- `GET /api/attendance/student/{studentId}`: Get attendance for specific student.
- `GET /api/attendance/date/{date}`: Get attendance records by date.
- `POST /api/attendance`: Mark attendance (`{ studentId, date, status, remarks }`).

## Maintenance Requests
- `GET /api/maintenance`: List maintenance requests.
- `GET /api/maintenance/student/{studentId}`: Get requests created by student.
- `POST /api/maintenance`: Create maintenance request (`{ studentId, roomId, category, description, priority }`).
- `PUT /api/maintenance/{id}/status`: Update request status (`{ status }`).

## Visitor Management
- `GET /api/visitors`: Get visitor logs.
- `GET /api/visitors/student/{studentId}`: Get visitors for a student.
- `POST /api/visitors`: Log new visitor entry (`{ studentId, visitorName, relation, phone, purpose }`).
- `PUT /api/visitors/{id}/checkout`: Mark visitor checkout.

## Fee & Payment Status
- `GET /api/payments`: Get payment invoices.
- `GET /api/payments/student/{studentId}`: Get payments for a student.
- `POST /api/payments`: Create payment record (`{ studentId, amount, paymentType, dueDate }`).
- `PUT /api/payments/{id}/pay`: Process payment and generate transaction ID.

## Reports
- `GET /api/reports/summary`: Aggregate metrics for administrative reports dashboard.
