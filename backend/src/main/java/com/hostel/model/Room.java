package com.hostel.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, unique = true, length = 20)
    private String roomNumber;

    @Column(name = "block_name", nullable = false, length = 20)
    private String blockName;

    @Column(nullable = false)
    private Integer floor = 1;

    @Column(nullable = false)
    private Integer capacity = 2;

    @Column(name = "current_occupancy", nullable = false)
    private Integer currentOccupancy = 0;

    @Column(name = "room_type", length = 30)
    private String roomType = "STANDARD";

    @Column(nullable = false, length = 20)
    private String status = "AVAILABLE"; // 'AVAILABLE', 'FULL', 'MAINTENANCE'

    public Room() {}

    public Room(Long id, String roomNumber, String blockName, Integer floor, Integer capacity, Integer currentOccupancy, String roomType, String status) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.blockName = blockName;
        this.floor = floor;
        this.capacity = capacity;
        this.currentOccupancy = currentOccupancy;
        this.roomType = roomType;
        this.status = status;
    }

    public Room(Long id, String roomNumber, String blockName, Integer capacity, Integer currentOccupancy, String roomType, String status) {
        this(id, roomNumber, blockName, 1, capacity, currentOccupancy, roomType, status);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getBlockName() { return blockName; }
    public void setBlockName(String blockName) { this.blockName = blockName; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
