package com.workforce.scheduling.controller;

import com.workforce.scheduling.dto.BookingSubmission;
import com.workforce.scheduling.model.BookingRequest;
import com.workforce.scheduling.model.ShiftSlot;
import com.workforce.scheduling.repository.BookingRequestRepository;
import com.workforce.scheduling.repository.ShiftSlotRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRequestRepository bookingRepository;

    @Autowired
    private ShiftSlotRepository shiftSlotRepository;

    @PostMapping("/request")
    public ResponseEntity<?> requestBooking(@Valid @RequestBody BookingSubmission submission) {
        Optional<ShiftSlot> slotOpt = shiftSlotRepository.findById(submission.getShiftSlotId());
        
        if (slotOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shift slot not found");
        }

        ShiftSlot slot = slotOpt.get();
        if (!slot.getStatus().equals("OPEN")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Shift slot is not open");
        }

        // Update slot status to PENDING
        slot.setStatus("PENDING");
        shiftSlotRepository.save(slot);

        // Record request log
        BookingRequest request = new BookingRequest(
                submission.getUserId(),
                slot,
                "BOOK",
                "PENDING",
                new Date().toLocaleString()
        );
        
        BookingRequest savedRequest = bookingRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        Optional<BookingRequest> reqOpt = bookingRepository.findById(id);
        if (reqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
        }

        BookingRequest request = reqOpt.get();
        ShiftSlot slot = request.getShiftSlot();

        request.setStatus("APPROVED");
        bookingRepository.save(request);

        slot.setStatus("CONFIRMED");
        slot.setAssignedUserId(request.getUserId());
        slot.setAssignedUsername("Employee #" + request.getUserId());
        shiftSlotRepository.save(slot);

        return ResponseEntity.ok(request);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id) {
        Optional<BookingRequest> reqOpt = bookingRepository.findById(id);
        if (reqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
        }

        BookingRequest request = reqOpt.get();
        ShiftSlot slot = request.getShiftSlot();

        request.setStatus("REJECTED");
        bookingRepository.save(request);

        slot.setStatus("OPEN");
        slot.setAssignedUserId(null);
        slot.setAssignedUsername(null);
        shiftSlotRepository.save(slot);

        return ResponseEntity.ok(request);
    }

    @PostMapping("/cancel-by-slot/{slotId}")
    public ResponseEntity<?> cancelBookingBySlot(@PathVariable Long slotId) {
        Optional<ShiftSlot> slotOpt = shiftSlotRepository.findById(slotId);
        if (slotOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shift slot not found");
        }

        ShiftSlot slot = slotOpt.get();
        if (!slot.getStatus().equals("CONFIRMED")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Shift is not currently confirmed");
        }

        Long userId = slot.getAssignedUserId();

        // Release slot
        slot.setStatus("OPEN");
        slot.setAssignedUserId(null);
        slot.setAssignedUsername(null);
        shiftSlotRepository.save(slot);

        // Record cancel log
        BookingRequest request = new BookingRequest(
                userId,
                slot,
                "CANCEL",
                "APPROVED",
                new Date().toLocaleString()
        );
        bookingRepository.save(request);

        return ResponseEntity.ok(request);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingRequest>> getUserRequests(@PathVariable Long userId) {
        List<BookingRequest> list = bookingRepository.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BookingRequest>> getPendingRequests() {
        List<BookingRequest> list = bookingRepository.findByStatus("PENDING");
        return ResponseEntity.ok(list);
    }
}
