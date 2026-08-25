package com.workforce.scheduling.repository;

import com.workforce.scheduling.model.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {
    List<BookingRequest> findByUserId(Long userId);
    List<BookingRequest> findByStatus(String status);
}
