package com.example.arthaai_backend.service;

import com.example.arthaai_backend.entity.Expense;
import com.example.arthaai_backend.entity.FinancialScore;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.repository.ExpenseRepository;
import com.example.arthaai_backend.repository.FinancialScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class FinancialScoreService {

    @Autowired
    private FinancialScoreRepository scoreRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public FinancialScore calculateAndSaveScore(User user) {
        // Simplified Phase 2 Engine - Will be enhanced in Phase 4 with Investments & Liabilities
        
        BigDecimal monthlyIncome = user.getAnnualIncome() != null 
            ? user.getAnnualIncome().divide(new BigDecimal(12), 2, RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;
            
        // Get expenses from last 30 days
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Expense> recentExpenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), thirtyDaysAgo, LocalDate.now());
        
        BigDecimal monthlyExpenses = recentExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 1. Savings Ratio Score (30%)
        int savingsScore = 0;
        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal savings = monthlyIncome.subtract(monthlyExpenses);
            double ratio = savings.divide(monthlyIncome, 4, RoundingMode.HALF_UP).doubleValue();
            if (ratio >= 0.40) savingsScore = 100;
            else if (ratio >= 0.25) savingsScore = 75;
            else if (ratio >= 0.10) savingsScore = 50;
            else savingsScore = 20;
        }

        // 2. Debt-to-Income Score (25%) - Stubbed for Phase 2
        int dtiScore = 100; // Assuming no debt until Phase 4

        // 3. Emergency Fund Score (20%) - Stubbed for Phase 2
        int emergencyScore = 40; // Default average

        // 4. Investment Consistency (15%) - Stubbed for Phase 2
        int investmentScore = 0; 

        // 5. Insurance Coverage (10%) - Stubbed for Phase 2
        int insuranceScore = 0;

        // Final weighted score
        int overallScore = (int) ((savingsScore * 0.30) + (dtiScore * 0.25) + 
                           (emergencyScore * 0.20) + (investmentScore * 0.15) + (insuranceScore * 0.10));

        FinancialScore score = scoreRepository.findByUserId(user.getId())
                .orElse(new FinancialScore());
                
        score.setUser(user);
        score.setSavingsRatioScore(savingsScore);
        score.setDebtRatioScore(dtiScore);
        score.setEmergencyFundScore(emergencyScore);
        score.setInvestmentScore(investmentScore);
        score.setInsuranceScore(insuranceScore);
        score.setOverallScore(overallScore);
        score.setAiCommentary("Your score is " + overallScore + ". Keep tracking expenses to improve your insights!");

        try {
            return scoreRepository.save(score);
        } catch (DataIntegrityViolationException ex) {
            return scoreRepository.findByUserId(user.getId())
                    .orElseThrow(() -> ex);
        }
    }

    public FinancialScore getLatestScore(User user) {
        return scoreRepository.findByUserId(user.getId())
                .orElseGet(() -> calculateAndSaveScore(user));
    }
}
