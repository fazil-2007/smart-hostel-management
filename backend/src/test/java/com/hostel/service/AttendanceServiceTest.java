package com.hostel.service;

import com.hostel.model.Attendance;
import com.hostel.model.Role;
import com.hostel.model.Student;
import com.hostel.model.User;
import com.hostel.repository.AttendanceRepository;
import com.hostel.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private Student student;
    private Attendance attendancePresent;
    private Attendance attendanceAbsent;

    @BeforeEach
    void setUp() {
        User user = new User(1L, "student1", "pass", Role.STUDENT, "Alex Mercer", "alex@student.edu", "123");
        student = new Student(1L, user, "CS2024001", "Computer Science", 3, "999", "123 Street");

        attendancePresent = new Attendance(1L, student, LocalDate.now(), "PRESENT", "Dr. Robert Vance", "On time");
        attendanceAbsent = new Attendance(2L, student, LocalDate.now().minusDays(1), "ABSENT", "Dr. Robert Vance", "Home visit");
    }

    @Test
    @DisplayName("Successfully mark new attendance record")
    void markAttendance_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(attendanceRepository.findByStudentIdAndDate(1L, LocalDate.now())).thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(i -> i.getArgument(0));

        Attendance result = attendanceService.markAttendance(1L, LocalDate.now(), "PRESENT", "On time", "Dr. Robert Vance");

        assertNotNull(result);
        assertEquals("PRESENT", result.getStatus());
        assertEquals("Dr. Robert Vance", result.getRecordedBy());
        assertEquals("On time", result.getRemarks());
        verify(attendanceRepository).save(any(Attendance.class));
    }

    @Test
    @DisplayName("Update existing attendance record for same student and date")
    void markAttendance_UpdateExisting() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(attendanceRepository.findByStudentIdAndDate(1L, LocalDate.now())).thenReturn(Optional.of(attendancePresent));
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(i -> i.getArgument(0));

        Attendance updated = attendanceService.markAttendance(1L, LocalDate.now(), "ABSENT", "Unexcused", "Dr. Robert Vance");

        assertEquals("ABSENT", updated.getStatus());
        assertEquals("Unexcused", updated.getRemarks());
        assertEquals(1L, updated.getId());
    }

    @Test
    @DisplayName("Calculate attendance percentage correctly")
    void getAttendancePercentage_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(attendanceRepository.findByStudentId(1L)).thenReturn(List.of(attendancePresent, attendanceAbsent));

        Map<String, Object> metrics = attendanceService.getAttendancePercentage(1L);

        assertEquals(1L, metrics.get("studentId"));
        assertEquals(2L, metrics.get("totalDays"));
        assertEquals(1L, metrics.get("presentDays"));
        assertEquals(1L, metrics.get("absentDays"));
        assertEquals(50.0, metrics.get("attendancePercentage"));
    }

    @Test
    @DisplayName("Throw exception when student not found during attendance marking")
    void markAttendance_ThrowsWhenStudentNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                attendanceService.markAttendance(99L, LocalDate.now(), "PRESENT", "Note", "Warden")
        );
    }
}
