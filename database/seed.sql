-- Smart Hostel Management and Student Services Platform
-- Database Seed Data

USE smart_hostel;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE visitors;
TRUNCATE TABLE maintenance_requests;
TRUNCATE TABLE attendance;
TRUNCATE TABLE room_allocations;
TRUNCATE TABLE rooms;
TRUNCATE TABLE students;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users (passwords are 'admin123', 'warden123', 'student123')
INSERT INTO users (id, username, password, role, full_name, email, phone) VALUES
(1, 'admin', 'admin123', 'ADMIN', 'System Administrator', 'admin@university.edu', '+1234567890'),
(2, 'warden1', 'warden123', 'WARDEN', 'Dr. Robert Vance', 'warden.vance@university.edu', '+1234567891'),
(3, 'student1', 'student123', 'STUDENT', 'Alex Mercer', 'alex.mercer@student.edu', '+1234567892'),
(4, 'student2', 'student123', 'STUDENT', 'Sophia Chen', 'sophia.chen@student.edu', '+1234567893'),
(5, 'student3', 'student123', 'STUDENT', 'Marcus Johnson', 'marcus.j@student.edu', '+1234567894');

-- 2. Insert Students
INSERT INTO students (id, user_id, roll_number, department, year_of_study, emergency_contact, address) VALUES
(1, 3, 'CS2024001', 'Computer Science', 3, '+1987654321', '124 Oak Street, Springfield'),
(2, 4, 'EC2024045', 'Electronics & Comm', 2, '+1987654322', '456 Maple Ave, Riverside'),
(3, 5, 'ME2024012', 'Mechanical Engg', 4, '+1987654323', '789 Pine Road, Hillview');

-- 3. Insert Rooms
INSERT INTO rooms (id, room_number, block_name, floor, capacity, current_occupancy, room_type, status) VALUES
(1, 'A-101', 'Block A', 1, 2, 2, 'STANDARD', 'FULL'),
(2, 'A-102', 'Block A', 1, 2, 1, 'STANDARD', 'AVAILABLE'),
(3, 'B-201', 'Block B', 2, 1, 0, 'DELUXE', 'AVAILABLE'),
(4, 'B-202', 'Block B', 2, 2, 0, 'STANDARD', 'MAINTENANCE'),
(5, 'C-301', 'Block C', 3, 3, 0, 'STANDARD', 'AVAILABLE');

-- 4. Insert Room Allocations
INSERT INTO room_allocations (id, student_id, room_id, allocation_date, vacate_date, status) VALUES
(1, 1, 1, '2025-08-01', NULL, 'ACTIVE'),
(2, 2, 1, '2025-08-01', NULL, 'ACTIVE'),
(3, 3, 2, '2025-08-05', NULL, 'ACTIVE');

-- 5. Insert Attendance Records
INSERT INTO attendance (id, student_id, date, status, remarks) VALUES
(1, 1, CURRENT_DATE(), 'PRESENT', 'On time'),
(2, 2, CURRENT_DATE(), 'PRESENT', 'On time'),
(3, 3, CURRENT_DATE(), 'LATE', 'Returned at 10:15 PM'),
(4, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 'PRESENT', 'Normal entry'),
(5, 2, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 'ABSENT', 'Permission granted for home visit');

-- 6. Insert Maintenance Requests
INSERT INTO maintenance_requests (id, student_id, room_id, category, description, status, priority, created_at) VALUES
(1, 1, 1, 'PLUMBING', 'Leaking bathroom faucet in room A-101.', 'IN_PROGRESS', 'HIGH', NOW()),
(2, 2, 1, 'ELECTRICAL', 'Study lamp socket not working.', 'PENDING', 'MEDIUM', NOW()),
(3, 3, 2, 'FURNITURE', 'Broken study chair cushion replacement.', 'RESOLVED', 'LOW', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 7. Insert Visitors
INSERT INTO visitors (id, student_id, visitor_name, relation, phone, entry_time, exit_time, purpose, status) VALUES
(1, 1, 'David Mercer', 'Father', '+1999888777', DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, 'Delivering academic books', 'CHECKED_IN'),
(2, 2, 'Elena Chen', 'Mother', '+1999888778', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 'Weekend visit', 'CHECKED_OUT');

-- 8. Insert Payments
INSERT INTO payments (id, student_id, amount, payment_type, due_date, paid_date, status, transaction_id) VALUES
(1, 1, 1200.00, 'HOSTEL_FEE', '2025-09-01', '2025-08-10', 'PAID', 'TXN-984710293'),
(2, 2, 1200.00, 'HOSTEL_FEE', '2025-09-01', NULL, 'PENDING', NULL),
(3, 3, 350.00, 'MESS_FEE', '2025-08-15', NULL, 'OVERDUE', NULL);
