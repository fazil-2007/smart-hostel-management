package com.hostel.service;

import com.hostel.model.Role;
import com.hostel.model.Room;
import com.hostel.model.RoomAllocation;
import com.hostel.model.Student;
import com.hostel.model.User;
import com.hostel.repository.RoomAllocationRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AllocationServiceTest {

    @Mock
    private RoomAllocationRepository allocationRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private AllocationService allocationService;

    private Student testStudent;
    private Room availableRoom;
    private Room fullRoom;
    private Room maintenanceRoom;

    @BeforeEach
    void setUp() {
        User user = new User(1L, "student1", "pass", Role.STUDENT, "Alex Mercer", "alex@student.edu", "123");
        testStudent = new Student(1L, user, "CS2024001", "Computer Science", 3, "999", "123 Street");

        availableRoom = new Room(1L, "A-102", "Block A", 1, 2, 1, "STANDARD", "AVAILABLE");
        fullRoom = new Room(2L, "A-101", "Block A", 1, 2, 2, "STANDARD", "FULL");
        maintenanceRoom = new Room(3L, "B-202", "Block B", 2, 2, 0, "STANDARD", "MAINTENANCE");
    }

    @Test
    @DisplayName("Successfully allocate room when room is available and student has no active allocation")
    void allocateRoom_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(availableRoom));
        when(allocationRepository.findByStudentIdAndStatus(1L, "ACTIVE")).thenReturn(Optional.empty());
        when(roomRepository.save(any(Room.class))).thenAnswer(i -> i.getArgument(0));
        when(allocationRepository.save(any(RoomAllocation.class))).thenAnswer(i -> i.getArgument(0));

        RoomAllocation result = allocationService.allocateRoom(1L, 1L);

        assertNotNull(result);
        assertEquals("ACTIVE", result.getStatus());
        assertEquals(testStudent, result.getStudent());
        assertEquals(availableRoom, result.getRoom());
        assertEquals(2, availableRoom.getCurrentOccupancy());
        assertEquals("FULL", availableRoom.getStatus());

        verify(roomRepository).save(availableRoom);
        verify(allocationRepository).save(any(RoomAllocation.class));
    }

    @Test
    @DisplayName("Throw exception when attempting to allocate a room that is full")
    void allocateRoom_ThrowsWhenRoomIsFull() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(fullRoom));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                allocationService.allocateRoom(1L, 2L)
        );

        assertTrue(ex.getMessage().contains("full capacity"));
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Throw exception when student already has an active room allocation")
    void allocateRoom_ThrowsWhenStudentAlreadyAllocated() {
        RoomAllocation existingAllocation = new RoomAllocation(10L, testStudent, fullRoom, null, null, "ACTIVE");

        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(availableRoom));
        when(allocationRepository.findByStudentIdAndStatus(1L, "ACTIVE")).thenReturn(Optional.of(existingAllocation));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                allocationService.allocateRoom(1L, 1L)
        );

        assertTrue(ex.getMessage().contains("already has an active room allocation"));
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Throw exception when room is under maintenance")
    void allocateRoom_ThrowsWhenRoomUnderMaintenance() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(roomRepository.findById(3L)).thenReturn(Optional.of(maintenanceRoom));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                allocationService.allocateRoom(1L, 3L)
        );

        assertTrue(ex.getMessage().contains("under maintenance"));
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Successfully vacate room and decrease room occupancy")
    void vacateRoom_Success() {
        RoomAllocation activeAllocation = new RoomAllocation(5L, testStudent, fullRoom, null, null, "ACTIVE");

        when(allocationRepository.findById(5L)).thenReturn(Optional.of(activeAllocation));
        when(roomRepository.save(any(Room.class))).thenAnswer(i -> i.getArgument(0));
        when(allocationRepository.save(any(RoomAllocation.class))).thenAnswer(i -> i.getArgument(0));

        RoomAllocation vacated = allocationService.vacateRoom(5L);

        assertEquals("VACATED", vacated.getStatus());
        assertNotNull(vacated.getVacateDate());
        assertEquals(1, fullRoom.getCurrentOccupancy());
        assertEquals("AVAILABLE", fullRoom.getStatus());
    }
}
