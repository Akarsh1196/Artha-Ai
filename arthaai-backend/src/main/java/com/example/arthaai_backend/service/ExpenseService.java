package com.example.arthaai_backend.service;

import com.example.arthaai_backend.dto.request.ExpenseRequest;
import com.example.arthaai_backend.entity.Expense;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses(User user) {
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    public Expense addExpense(User user, ExpenseRequest request) {
        Expense expense = Expense.builder()
                .user(user)
                .amount(request.getAmount())
                .category(request.getCategory())
                .subCategory(request.getSubCategory())
                .date(request.getDate())
                .paymentMode(request.getPaymentMode())
                .notes(request.getNotes())
                .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false)
                .build();
                
        return expenseRepository.save(expense);
    }

    public void deleteExpense(User user, UUID expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
                
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        expenseRepository.delete(expense);
    }
}
