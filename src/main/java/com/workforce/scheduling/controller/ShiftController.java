package com.workforce.scheduling.controller;

import com.workforce.scheduling.model.ShiftSlot;
import com.workforce.scheduling.repository.ShiftSlotRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private ShiftSlotRepository shiftSlotRepository;

    @GetMapping
    public ResponseEntity<List<ShiftSlot>> getAllShifts() {
        List<ShiftSlot> slots = shiftSlotRepository.findAll();
        
        // Seed default slots with current/future dates if database is empty
        if (slots.isEmpty()) {
            String today = LocalDate.now().toString();
            String tomorrow = LocalDate.now().plusDays(1).toString();
            shiftSlotRepository.save(new ShiftSlot(today, "08:00", "16:00", "Associate", "OPEN"));
            shiftSlotRepository.save(new ShiftSlot(today, "16:00", "24:00", "Supervisor", "OPEN"));
            shiftSlotRepository.save(new ShiftSlot(tomorrow, "08:00", "16:00", "Lead Analyst", "OPEN"));
            shiftSlotRepository.save(new ShiftSlot(tomorrow, "16:00", "24:00", "Associate", "OPEN"));
            slots = shiftSlotRepository.findAll();
        }
        
        return ResponseEntity.ok(slots);
    }

    @PostMapping
    public ResponseEntity<?> createShift(@Valid @RequestBody ShiftSlot shiftSlot) {
        if (shiftSlot.getDate() != null) {
            try {
                LocalDate slotDate = LocalDate.parse(shiftSlot.getDate());
                if (slotDate.isBefore(LocalDate.now())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Shift date cannot be in the past. Please select today or a future date.");
                }
            } catch (DateTimeParseException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid date format. Expected YYYY-MM-DD.");
            }
        }

        shiftSlot.setStatus("OPEN");
        shiftSlot.setAssignedUserId(null);
        shiftSlot.setAssignedUsername(null);
        
        ShiftSlot savedSlot = shiftSlotRepository.save(shiftSlot);
        return ResponseEntity.ok(savedSlot);
    }
}
