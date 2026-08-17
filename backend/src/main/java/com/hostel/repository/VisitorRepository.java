package com.hostel.repository;

import com.hostel.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByStudentId(Long studentId);
    List<Visitor> findByStatus(String status);
}
