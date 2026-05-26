package com.example.arthaai_backend.repository;

import com.example.arthaai_backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByUserIdOrderByDateDesc(UUID userId);
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.date >= :startDate AND e.date <= :endDate ORDER BY e.date DESC")
    List<Expense> findByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);
}
