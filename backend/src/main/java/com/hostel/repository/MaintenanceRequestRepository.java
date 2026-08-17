package com.hostel.repository;

import com.hostel.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStudentId(Long studentId);
    List<MaintenanceRequest> findByRoomId(Long roomId);
    List<MaintenanceRequest> findByStatus(String status);
    Long countByStatus(String status);
}
