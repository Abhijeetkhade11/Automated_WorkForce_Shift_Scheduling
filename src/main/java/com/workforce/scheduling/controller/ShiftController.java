package com.workforce.scheduling.controller;

import com.workforce.scheduling.model.ShiftSlot;
import com.workforce.scheduling.repository.ShiftSlotRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private ShiftSlotRepository shiftSlotRepository;

    @GetMapping
    public ResponseEntity<List<ShiftSlot>> getAllShifts() {
        List<ShiftSlot> slots = shiftSlotRepository.findAll();
        
        // Seed default slots for dev/test ease if database is empty
        if (slots.isEmpty()) {
            shiftSlotRepository.save(new ShiftSlot("2026-08-25", "08:00", "16:00", "Associate", "OPEN"));
            shiftSlotRepository.save(new ShiftSlot("2026-08-25", "16:00", "24:00", "Supervisor", "OPEN"));
            shiftSlotRepository.save(new ShiftSlot("2026-08-26", "08:00", "16:00", "Lead Analyst", "OPEN"));
            shiftSlotRepository.save(new ShiftSlot("2026-08-26", "16:00", "24:00", "Associate", "OPEN"));
            slots = shiftSlotRepository.findAll();
        }
        
        return ResponseEntity.ok(slots);
    }

    @PostMapping
    public ResponseEntity<?> createShift(@Valid @RequestBody ShiftSlot shiftSlot) {
        shiftSlot.setStatus("OPEN");
        shiftSlot.setAssignedUserId(null);
        shiftSlot.setAssignedUsername(null);
        
        ShiftSlot savedSlot = shiftSlotRepository.save(shiftSlot);
        return ResponseEntity.ok(savedSlot);
    }
}
