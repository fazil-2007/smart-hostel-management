package com.hostel.controller;

import com.hostel.model.Attendance;
import com.hostel.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/percentage")
    public ResponseEntity<Map<String, Object>> getAttendancePercentage(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId));
    }

    @GetMapping("/percentages")
    public ResponseEntity<List<Map<String, Object>>> getAllAttendancePercentages() {
        return ResponseEntity.ok(attendanceService.getAllAttendancePercentages());
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(@RequestBody Map<String, Object> payload) {
        if (payload.get("studentId") == null) {
            throw new IllegalArgumentException("studentId is required");
        }

        Long studentId = Long.valueOf(payload.get("studentId").toString());
        LocalDate date = payload.get("date") != null && !payload.get("date").toString().trim().isEmpty() ?
                LocalDate.parse(payload.get("date").toString()) : LocalDate.now();
        String status = payload.getOrDefault("status", "PRESENT").toString();
        String remarks = payload.get("remarks") != null ? payload.get("remarks").toString() : null;
        String recordedBy = payload.get("recordedBy") != null ? payload.get("recordedBy").toString() : "Warden";

        return ResponseEntity.ok(attendanceService.markAttendance(studentId, date, status, remarks, recordedBy));
    }
}
