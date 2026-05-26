package com.example.arthaai_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotBlank
    private String category;

    private String subCategory;

    @NotNull
    private LocalDate date;

    private String paymentMode;
    
    private String notes;
    
    private Boolean isRecurring;
}
