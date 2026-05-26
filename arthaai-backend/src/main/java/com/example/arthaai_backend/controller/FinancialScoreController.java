package com.example.arthaai_backend.controller;

import com.example.arthaai_backend.entity.FinancialScore;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.service.FinancialScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financial-score")
@CrossOrigin(origins = "*")
public class FinancialScoreController {

    @Autowired
    private FinancialScoreService scoreService;

    @GetMapping
    public ResponseEntity<FinancialScore> getScore(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(scoreService.getLatestScore(user));
    }

    @PostMapping("/calculate")
    public ResponseEntity<FinancialScore> calculateScore(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(scoreService.calculateAndSaveScore(user));
    }
}
