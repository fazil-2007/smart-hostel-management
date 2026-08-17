package com.hostel.service;

import com.hostel.dto.DashboardSummaryDTO;
import com.hostel.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ReportService {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final MaintenanceRequestRepository maintenanceRepository;
    private final VisitorRepository visitorRepository;
    private final PaymentRepository paymentRepository;
    private final AttendanceRepository attendanceRepository;

    public ReportService(StudentRepository studentRepository,
                         RoomRepository roomRepository,
                         MaintenanceRequestRepository maintenanceRepository,
                         VisitorRepository visitorRepository,
                         PaymentRepository paymentRepository,
                         AttendanceRepository attendanceRepository) {
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.visitorRepository = visitorRepository;
        this.paymentRepository = paymentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public DashboardSummaryDTO getDashboardSummary() {
        long totalStudents = studentRepository.count();
        long totalRooms = roomRepository.count();
        long occupiedRooms = roomRepository.findByStatus("FULL").size();
        long availableRooms = roomRepository.findByStatus("AVAILABLE").size();
        long pendingMaintenance = maintenanceRepository.countByStatus("PENDING");
        long activeVisitors = visitorRepository.findByStatus("CHECKED_IN").size();
        long pendingPayments = paymentRepository.countByStatus("PENDING");
        long presentToday = attendanceRepository.countByDateAndStatus(LocalDate.now(), "PRESENT");

        return new DashboardSummaryDTO(
                totalStudents,
                totalRooms,
                occupiedRooms,
                availableRooms,
                pendingMaintenance,
                activeVisitors,
                pendingPayments,
                presentToday
        );
    }
}
