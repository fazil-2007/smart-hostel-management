package com.hostel.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "room_allocations")
public class RoomAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "allocation_date", nullable = false)
    private LocalDate allocationDate;

    @Column(name = "vacate_date")
    private LocalDate vacateDate;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // 'ACTIVE', 'VACATED'

    public RoomAllocation() {}

    public RoomAllocation(Long id, Student student, Room room, LocalDate allocationDate, LocalDate vacateDate, String status) {
        this.id = id;
        this.student = student;
        this.room = room;
        this.allocationDate = allocationDate;
        this.vacateDate = vacateDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public LocalDate getAllocationDate() { return allocationDate; }
    public void setAllocationDate(LocalDate allocationDate) { this.allocationDate = allocationDate; }

    public LocalDate getVacateDate() { return vacateDate; }
    public void setVacateDate(LocalDate vacateDate) { this.vacateDate = vacateDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
