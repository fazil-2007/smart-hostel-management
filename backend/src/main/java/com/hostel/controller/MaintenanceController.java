package com.hostel.controller;

import com.hostel.model.MaintenanceRequest;
import com.hostel.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequest>> getAllRequests() {
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MaintenanceRequest>> getRequestsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(maintenanceService.getRequestsByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> createRequest(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long roomId = Long.valueOf(payload.get("roomId").toString());
        String category = payload.get("category").toString();
        String description = payload.get("description").toString();
        String priority = payload.get("priority") != null ? payload.get("priority").toString() : "MEDIUM";

        return ResponseEntity.ok(maintenanceService.createRequest(studentId, roomId, category, description, priority));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequest> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(maintenanceService.updateStatus(id, status));
    }
}
