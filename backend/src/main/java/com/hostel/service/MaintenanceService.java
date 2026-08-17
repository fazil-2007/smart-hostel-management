package com.hostel.service;

import com.hostel.model.MaintenanceRequest;
import com.hostel.model.Room;
import com.hostel.model.Student;
import com.hostel.repository.MaintenanceRequestRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;

    public MaintenanceService(MaintenanceRequestRepository maintenanceRepository, StudentRepository studentRepository, RoomRepository roomRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    public List<MaintenanceRequest> getAllRequests() {
        return maintenanceRepository.findAll();
    }

    public List<MaintenanceRequest> getRequestsByStudent(Long studentId) {
        return maintenanceRepository.findByStudentId(studentId);
    }

    public MaintenanceRequest createRequest(Long studentId, Long roomId, String category, String description, String priority) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        MaintenanceRequest request = new MaintenanceRequest();
        request.setStudent(student);
        request.setRoom(room);
        request.setCategory(category);
        request.setDescription(description);
        request.setPriority(priority != null ? priority : "MEDIUM");
        request.setStatus("PENDING");

        return maintenanceRepository.save(request);
    }

    public MaintenanceRequest updateStatus(Long requestId, String status) {
        MaintenanceRequest request = maintenanceRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
        request.setStatus(status);
        return maintenanceRepository.save(request);
    }
}
