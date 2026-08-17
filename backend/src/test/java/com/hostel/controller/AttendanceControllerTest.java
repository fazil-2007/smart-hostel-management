package com.hostel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.exception.GlobalExceptionHandler;
import com.hostel.model.Attendance;
import com.hostel.model.Role;
import com.hostel.model.Student;
import com.hostel.model.User;
import com.hostel.service.AttendanceService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AttendanceController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc(addFilters = false)
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AttendanceService attendanceService;

    @MockitoBean
    private com.hostel.security.JwtUtils jwtUtils;

    @MockitoBean
    private com.hostel.security.JwtAuthFilter jwtAuthFilter;

    @MockitoBean
    private com.hostel.repository.UserRepository userRepository;

    private Student student;
    private Attendance attendance;

    @BeforeEach
    void setUp() {
        User user = new User(1L, "student1", "pass", Role.STUDENT, "Alex Mercer", "alex@student.edu", "123");
        student = new Student(1L, user, "CS2024001", "Computer Science", 3, "999", "123 Street");
        attendance = new Attendance(1L, student, LocalDate.now(), "PRESENT", "Dr. Robert Vance", "On time");
    }

    @Test
    @DisplayName("GET /api/attendance returns all attendance records")
    void getAllAttendance_Success() throws Exception {
        when(attendanceService.getAllAttendance()).thenReturn(List.of(attendance));

        mockMvc.perform(get("/api/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].status").value("PRESENT"))
                .andExpect(jsonPath("$[0].recordedBy").value("Dr. Robert Vance"));
    }

    @Test
    @DisplayName("GET /api/attendance/student/{studentId} returns attendance records for student")
    void getAttendanceByStudent_Success() throws Exception {
        when(attendanceService.getAttendanceByStudent(1L)).thenReturn(List.of(attendance));

        mockMvc.perform(get("/api/attendance/student/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].student.rollNumber").value("CS2024001"));
    }

    @Test
    @DisplayName("GET /api/attendance/student/{studentId}/percentage returns student attendance percentage metrics")
    void getAttendancePercentage_Success() throws Exception {
        Map<String, Object> metrics = Map.of(
                "studentId", 1L,
                "totalDays", 10L,
                "presentDays", 9L,
                "absentDays", 1L,
                "attendancePercentage", 90.0
        );

        when(attendanceService.getAttendancePercentage(1L)).thenReturn(metrics);

        mockMvc.perform(get("/api/attendance/student/1/percentage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attendancePercentage").value(90.0))
                .andExpect(jsonPath("$.presentDays").value(9));
    }

    @Test
    @DisplayName("POST /api/attendance creates or updates attendance record")
    void markAttendance_Success() throws Exception {
        when(attendanceService.markAttendance(eq(1L), any(), eq("PRESENT"), eq("On time"), eq("Dr. Robert Vance")))
                .thenReturn(attendance);

        Map<String, Object> payload = Map.of(
                "studentId", 1L,
                "date", LocalDate.now().toString(),
                "status", "PRESENT",
                "remarks", "On time",
                "recordedBy", "Dr. Robert Vance"
        );

        mockMvc.perform(post("/api/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PRESENT"))
                .andExpect(jsonPath("$.recordedBy").value("Dr. Robert Vance"));
    }
}
