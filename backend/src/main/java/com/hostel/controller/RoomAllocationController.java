package com.hostel.controller;

import com.hostel.model.RoomAllocation;
import com.hostel.service.AllocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/allocations")
public class RoomAllocationController {

    private final AllocationService allocationService;

    public RoomAllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public ResponseEntity<List<RoomAllocation>> getAllAllocations() {
        return ResponseEntity.ok(allocationService.getAllAllocations());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RoomAllocation>> getStudentAllocations(@PathVariable Long studentId) {
        return ResponseEntity.ok(allocationService.getStudentAllocations(studentId));
    }

    @GetMapping("/student/{studentId}/active")
    public ResponseEntity<RoomAllocation> getStudentActiveAllocation(@PathVariable Long studentId) {
        return allocationService.getStudentActiveAllocation(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RoomAllocation> allocateRoom(@RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        Long roomId = payload.get("roomId");
        return ResponseEntity.ok(allocationService.allocateRoom(studentId, roomId));
    }

    @PutMapping("/{id}/vacate")
    public ResponseEntity<RoomAllocation> vacateRoom(@PathVariable Long id) {
        return ResponseEntity.ok(allocationService.vacateRoom(id));
    }
}
