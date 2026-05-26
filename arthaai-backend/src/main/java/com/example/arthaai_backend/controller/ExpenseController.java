package com.example.arthaai_backend.controller;

import com.example.arthaai_backend.dto.request.ExpenseRequest;
import com.example.arthaai_backend.entity.Expense;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.getAllExpenses(user));
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@AuthenticationPrincipal User user, @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        expenseService.deleteExpense(user, id);
        return ResponseEntity.noContent().build();
    }
}
