package com.hostel.controller;

import com.hostel.model.Payment;
import com.hostel.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Payment> createPaymentRecord(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String paymentType = payload.get("paymentType").toString();
        LocalDate dueDate = LocalDate.parse(payload.get("dueDate").toString());

        return ResponseEntity.ok(paymentService.createPaymentRecord(studentId, amount, paymentType, dueDate));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Payment> processPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.processPayment(id));
    }
}
