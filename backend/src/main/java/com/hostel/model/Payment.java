package com.hostel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_type", nullable = false, length = 50)
    private String paymentType; // 'HOSTEL_FEE', 'MESS_FEE', 'SECURITY_DEPOSIT', 'MAINTENANCE_FINE'

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // 'PAID', 'PENDING', 'OVERDUE'

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    public Payment() {}

    public Payment(Long id, Student student, BigDecimal amount, String paymentType, LocalDate dueDate, LocalDate paidDate, String status, String transactionId) {
        this.id = id;
        this.student = student;
        this.amount = amount;
        this.paymentType = paymentType;
        this.dueDate = dueDate;
        this.paidDate = paidDate;
        this.status = status;
        this.transactionId = transactionId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
}
