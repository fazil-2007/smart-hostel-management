package com.hostel.service;

import com.hostel.model.Attendance;
import com.hostel.model.Student;
import com.hostel.repository.AttendanceRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Transactional
    public Attendance markAttendance(Long studentId, LocalDate date, String status, String remarks, String recordedBy) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        if (date == null) {
            date = LocalDate.now();
        }

        if (status == null || status.trim().isEmpty()) {
            status = "PRESENT";
        }

        Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndDate(studentId, date);
        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
        } else {
            attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setDate(date);
        }

        attendance.setStatus(status.toUpperCase());
        attendance.setRecordedBy(recordedBy != null && !recordedBy.trim().isEmpty() ? recordedBy : "Warden");
        attendance.setRemarks(remarks);
        return attendanceRepository.save(attendance);
    }

    public Map<String, Object> getAttendancePercentage(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        List<Attendance> records = attendanceRepository.findByStudentId(studentId);
        long totalDays = records.size();
        long presentDays = records.stream()
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()) || "LATE".equalsIgnoreCase(a.getStatus()))
                .count();
        long absentDays = records.stream()
                .filter(a -> "ABSENT".equalsIgnoreCase(a.getStatus()))
                .count();

        double percentage = totalDays > 0 ? ((double) presentDays / totalDays) * 100.0 : 100.0;
        double roundedPercentage = Math.round(percentage * 10.0) / 10.0;

        Map<String, Object> result = new HashMap<>();
        result.put("studentId", studentId);
        result.put("rollNumber", student.getRollNumber());
        result.put("studentName", student.getUser() != null ? student.getUser().getFullName() : student.getRollNumber());
        result.put("totalDays", totalDays);
        result.put("presentDays", presentDays);
        result.put("absentDays", absentDays);
        result.put("attendancePercentage", roundedPercentage);

        return result;
    }

    public List<Map<String, Object>> getAllAttendancePercentages() {
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Student s : students) {
            list.add(getAttendancePercentage(s.getId()));
        }
        return list;
    }
}
