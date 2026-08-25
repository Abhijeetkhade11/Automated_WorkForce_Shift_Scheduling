package com.workforce.scheduling.dto;

import jakarta.validation.constraints.NotNull;

public class BookingSubmission {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Shift Slot ID is required")
    private Long shiftSlotId;

    public BookingSubmission() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getShiftSlotId() {
        return shiftSlotId;
    }

    public void setShiftSlotId(Long shiftSlotId) {
        this.shiftSlotId = shiftSlotId;
    }
}
