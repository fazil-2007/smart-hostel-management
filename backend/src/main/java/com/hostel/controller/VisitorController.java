package com.hostel.controller;

import com.hostel.model.Visitor;
import com.hostel.service.VisitorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitors")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping
    public ResponseEntity<List<Visitor>> getAllVisitors() {
        return ResponseEntity.ok(visitorService.getAllVisitors());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Visitor>> getVisitorsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(visitorService.getVisitorsByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Visitor> logVisitorEntry(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        String visitorName = payload.get("visitorName").toString();
        String relation = payload.get("relation").toString();
        String phone = payload.get("phone").toString();
        String purpose = payload.get("purpose").toString();

        return ResponseEntity.ok(visitorService.logVisitorEntry(studentId, visitorName, relation, phone, purpose));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<Visitor> checkoutVisitor(@PathVariable Long id) {
        return ResponseEntity.ok(visitorService.checkoutVisitor(id));
    }
}
