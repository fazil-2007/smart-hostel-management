package com.hostel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.exception.GlobalExceptionHandler;
import com.hostel.model.Role;
import com.hostel.model.Room;
import com.hostel.model.RoomAllocation;
import com.hostel.model.Student;
import com.hostel.model.User;
import com.hostel.service.AllocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {RoomAllocationController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc(addFilters = false)
class RoomAllocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AllocationService allocationService;

    @MockitoBean
    private com.hostel.security.JwtUtils jwtUtils;

    @MockitoBean
    private com.hostel.security.JwtAuthFilter jwtAuthFilter;

    @MockitoBean
    private com.hostel.repository.UserRepository userRepository;

    private Student student;
    private Room room;
    private RoomAllocation allocation;

    @BeforeEach
    void setUp() {
        User user = new User(1L, "student1", "pass", Role.STUDENT, "Alex Mercer", "alex@student.edu", "123");
        student = new Student(1L, user, "CS2024001", "Computer Science", 3, "999", "123 Street");
        room = new Room(1L, "A-102", "Block A", 1, 2, 1, "STANDARD", "AVAILABLE");
        allocation = new RoomAllocation(1L, student, room, LocalDate.now(), null, "ACTIVE");
    }

    @Test
    @DisplayName("GET /api/allocations returns all allocations")
    void getAllAllocations_Success() throws Exception {
        when(allocationService.getAllAllocations()).thenReturn(List.of(allocation));

        mockMvc.perform(get("/api/allocations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].room.roomNumber").value("A-102"));
    }

    @Test
    @DisplayName("GET /api/allocations/student/{studentId} returns allocations for specific student")
    void getStudentAllocations_Success() throws Exception {
        when(allocationService.getStudentAllocations(1L)).thenReturn(List.of(allocation));

        mockMvc.perform(get("/api/allocations/student/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].student.rollNumber").value("CS2024001"));
    }

    @Test
    @DisplayName("POST /api/allocations returns created allocation on valid request")
    void allocateRoom_Success() throws Exception {
        when(allocationService.allocateRoom(eq(1L), eq(1L))).thenReturn(allocation);

        Map<String, Long> payload = Map.of("studentId", 1L, "roomId", 1L);

        mockMvc.perform(post("/api/allocations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    @DisplayName("POST /api/allocations returns 400 Bad Request when room is full or duplicate allocation")
    void allocateRoom_Failure_BadRequest() throws Exception {
        when(allocationService.allocateRoom(eq(1L), eq(1L)))
                .thenThrow(new IllegalStateException("Room A-101 is at full capacity."));

        Map<String, Long> payload = Map.of("studentId", 1L, "roomId", 1L);

        mockMvc.perform(post("/api/allocations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Room A-101 is at full capacity."));
    }
}
