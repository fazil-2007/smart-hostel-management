package com.hostel.service;

import com.hostel.model.Student;
import com.hostel.model.Visitor;
import com.hostel.repository.StudentRepository;
import com.hostel.repository.VisitorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final StudentRepository studentRepository;

    public VisitorService(VisitorRepository visitorRepository, StudentRepository studentRepository) {
        this.visitorRepository = visitorRepository;
        this.studentRepository = studentRepository;
    }

    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    public List<Visitor> getVisitorsByStudent(Long studentId) {
        return visitorRepository.findByStudentId(studentId);
    }

    public Visitor logVisitorEntry(Long studentId, String visitorName, String relation, String phone, String purpose) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Visitor visitor = new Visitor();
        visitor.setStudent(student);
        visitor.setVisitorName(visitorName);
        visitor.setRelation(relation);
        visitor.setPhone(phone);
        visitor.setPurpose(purpose);
        visitor.setEntryTime(LocalDateTime.now());
        visitor.setStatus("CHECKED_IN");

        return visitorRepository.save(visitor);
    }

    public Visitor checkoutVisitor(Long visitorId) {
        Visitor visitor = visitorRepository.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor record not found"));

        visitor.setExitTime(LocalDateTime.now());
        visitor.setStatus("CHECKED_OUT");
        return visitorRepository.save(visitor);
    }
}
