package com.workforce.scheduling.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shift_slots")
public class ShiftSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String date; // "YYYY-MM-DD"

    @Column(nullable = false)
    private String startTime; // "HH:MM"

    @Column(nullable = false)
    private String endTime; // "HH:MM"

    @Column(nullable = false)
    private String requiredRole;

    @Column(nullable = false)
    private String status; // "OPEN", "PENDING", "CONFIRMED"

    private Long assignedUserId;

    private String assignedUsername;

    public ShiftSlot() {
    }

    public ShiftSlot(String date, String startTime, String endTime, String requiredRole, String status) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.requiredRole = requiredRole;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getRequiredRole() {
        return requiredRole;
    }

    public void setRequiredRole(String requiredRole) {
        this.requiredRole = requiredRole;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public String getAssignedUsername() {
        return assignedUsername;
    }

    public void setAssignedUsername(String assignedUsername) {
        this.assignedUsername = assignedUsername;
    }
}
