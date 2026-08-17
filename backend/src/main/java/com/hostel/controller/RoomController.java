package com.hostel.controller;

import com.hostel.model.Room;
import com.hostel.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Object>> getOccupancyMetrics() {
        List<Room> rooms = roomService.getAllRooms();
        int totalCapacity = rooms.stream().mapToInt(Room::getCapacity).sum();
        int totalOccupancy = rooms.stream().mapToInt(Room::getCurrentOccupancy).sum();
        double occupancyRate = totalCapacity > 0 ? ((double) totalOccupancy / totalCapacity) * 100 : 0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRooms", rooms.size());
        metrics.put("totalCapacity", totalCapacity);
        metrics.put("totalOccupancy", totalOccupancy);
        metrics.put("availableSpots", totalCapacity - totalOccupancy);
        metrics.put("occupancyPercentage", Math.round(occupancyRate * 10.0) / 10.0);

        return ResponseEntity.ok(metrics);
    }

    @PostMapping
    public ResponseEntity<Room> saveRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.saveRoom(room));
    }
}
