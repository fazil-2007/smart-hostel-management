package com.hostel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "visitor_name", nullable = false, length = 100)
    private String visitorName;

    @Column(nullable = false, length = 50)
    private String relation;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(nullable = false, length = 255)
    private String purpose;

    @Column(nullable = false, length = 20)
    private String status = "CHECKED_IN"; // 'CHECKED_IN', 'CHECKED_OUT'

    public Visitor() {}

    public Visitor(Long id, Student student, String visitorName, String relation, String phone, LocalDateTime entryTime, LocalDateTime exitTime, String purpose, String status) {
        this.id = id;
        this.student = student;
        this.visitorName = visitorName;
        this.relation = relation;
        this.phone = phone;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.purpose = purpose;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }

    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }

    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
