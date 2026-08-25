package com.workforce.scheduling.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "booking_requests")
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shift_slot_id", nullable = false)
    private ShiftSlot shiftSlot;

    @Column(nullable = false)
    private String requestType; // "BOOK" or "CANCEL"

    @Column(nullable = false)
    private String status; // "PENDING", "APPROVED", "REJECTED", "CANCELLED"

    @Column(nullable = false)
    private String timestamp;

    public BookingRequest() {
    }

    public BookingRequest(Long userId, ShiftSlot shiftSlot, String requestType, String status, String timestamp) {
        this.userId = userId;
        this.shiftSlot = shiftSlot;
        this.requestType = requestType;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public ShiftSlot getShiftSlot() {
        return shiftSlot;
    }

    public void setShiftSlot(ShiftSlot shiftSlot) {
        this.shiftSlot = shiftSlot;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
