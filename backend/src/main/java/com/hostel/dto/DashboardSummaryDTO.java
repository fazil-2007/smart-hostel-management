package com.hostel.dto;

public class DashboardSummaryDTO {

    private long totalStudents;
    private long totalRooms;
    private long occupiedRooms;
    private long availableRooms;
    private long pendingMaintenanceRequests;
    private long activeVisitors;
    private long pendingPayments;
    private long presentStudentsToday;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(long totalStudents, long totalRooms, long occupiedRooms, long availableRooms,
                               long pendingMaintenanceRequests, long activeVisitors, long pendingPayments, long presentStudentsToday) {
        this.totalStudents = totalStudents;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
        this.availableRooms = availableRooms;
        this.pendingMaintenanceRequests = pendingMaintenanceRequests;
        this.activeVisitors = activeVisitors;
        this.pendingPayments = pendingPayments;
        this.presentStudentsToday = presentStudentsToday;
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(long availableRooms) { this.availableRooms = availableRooms; }

    public long getPendingMaintenanceRequests() { return pendingMaintenanceRequests; }
    public void setPendingMaintenanceRequests(long pendingMaintenanceRequests) { this.pendingMaintenanceRequests = pendingMaintenanceRequests; }

    public long getActiveVisitors() { return activeVisitors; }
    public void setActiveVisitors(long activeVisitors) { this.activeVisitors = activeVisitors; }

    public long getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(long pendingPayments) { this.pendingPayments = pendingPayments; }

    public long getPresentStudentsToday() { return presentStudentsToday; }
    public void setPresentStudentsToday(long presentStudentsToday) { this.presentStudentsToday = presentStudentsToday; }
}
