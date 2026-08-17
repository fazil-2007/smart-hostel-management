package com.hostel.service;

import com.hostel.model.Room;
import com.hostel.model.RoomAllocation;
import com.hostel.model.Student;
import com.hostel.repository.RoomAllocationRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AllocationService {

    private final RoomAllocationRepository allocationRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;

    public AllocationService(RoomAllocationRepository allocationRepository, StudentRepository studentRepository, RoomRepository roomRepository) {
        this.allocationRepository = allocationRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    public List<RoomAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    @Transactional
    public RoomAllocation allocateRoom(Long studentId, Long roomId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            throw new RuntimeException("Room is at full capacity");
        }

        // Check if student already has active allocation
        Optional<RoomAllocation> activeOpt = allocationRepository.findByStudentIdAndStatus(studentId, "ACTIVE");
        if (activeOpt.isPresent()) {
            throw new RuntimeException("Student already has an active room allocation");
        }

        RoomAllocation allocation = new RoomAllocation();
        allocation.setStudent(student);
        allocation.setRoom(room);
        allocation.setAllocationDate(LocalDate.now());
        allocation.setStatus("ACTIVE");

        room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            room.setStatus("FULL");
        }
        roomRepository.save(room);

        return allocationRepository.save(allocation);
    }

    @Transactional
    public RoomAllocation vacateRoom(Long allocationId) {
        RoomAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        if ("VACATED".equals(allocation.getStatus())) {
            return allocation;
        }

        allocation.setStatus("VACATED");
        allocation.setVacateDate(LocalDate.now());

        Room room = allocation.getRoom();
        if (room.getCurrentOccupancy() > 0) {
            room.setCurrentOccupancy(room.getCurrentOccupancy() - 1);
        }
        if (room.getCurrentOccupancy() < room.getCapacity() && !"MAINTENANCE".equals(room.getStatus())) {
            room.setStatus("AVAILABLE");
        }
        roomRepository.save(room);

        return allocationRepository.save(allocation);
    }
}
