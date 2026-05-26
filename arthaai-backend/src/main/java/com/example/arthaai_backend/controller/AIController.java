package com.example.arthaai_backend.controller;

import com.example.arthaai_backend.entity.ChatMessage;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.service.GeminiService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @Data
    public static class ChatRequest {
        private String message;
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@AuthenticationPrincipal User user, @RequestBody ChatRequest request) {
        return geminiService.streamChat(user, request.getMessage())
                .map(text -> "data: " + text.replace("\n", "\\n") + "\n\n");
    }

    @GetMapping("/chat/history")
    public ResponseEntity<List<ChatMessage>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(geminiService.getHistory(user));
    }

    @DeleteMapping("/chat/history")
    public ResponseEntity<Void> clearHistory(@AuthenticationPrincipal User user) {
        geminiService.clearHistory(user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/advice/daily")
    public ResponseEntity<Map<String, String>> getDailyTip(@AuthenticationPrincipal User user) {
        String tip = geminiService.generateDailyTip(user);
        return ResponseEntity.ok(Map.of("tip", tip));
    }
}
