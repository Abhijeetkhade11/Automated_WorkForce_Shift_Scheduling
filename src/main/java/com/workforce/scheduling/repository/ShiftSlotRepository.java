package com.workforce.scheduling.repository;

import com.workforce.scheduling.model.ShiftSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftSlotRepository extends JpaRepository<ShiftSlot, Long> {
}
