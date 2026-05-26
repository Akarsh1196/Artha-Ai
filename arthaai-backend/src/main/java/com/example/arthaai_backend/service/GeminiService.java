package com.example.arthaai_backend.service;

import com.example.arthaai_backend.entity.ChatMessage;
import com.example.arthaai_backend.entity.FinancialScore;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.repository.ChatHistoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private FinancialScoreService financialScoreService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final WebClient webClient;

    public GeminiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash")
                .build();
    }

    private String buildSystemInstruction(User user, FinancialScore score) {
        return "You are ArthaAI, a highly intelligent and empathetic personal finance advisor designed specifically for the Indian market. " +
                "You provide concise, actionable, and mathematically sound financial advice. " +
                "\nUser Profile:" +
                "\nName: " + user.getFullName() +
                "\nAnnual Income: " + (user.getAnnualIncome() != null ? "₹" + user.getAnnualIncome() : "Unknown") +
                "\nRisk Appetite: " + (user.getRiskAppetite() != null ? user.getRiskAppetite() : "Unknown") +
                "\n\nCurrent Financial Health Score: " + (score != null ? score.getOverallScore() + "/100" : "Unknown") +
                "\n(Savings: " + (score != null ? score.getSavingsRatioScore() : "-") + ", DTI: " + (score != null ? score.getDebtRatioScore() : "-") + ", Emergency: " + (score != null ? score.getEmergencyFundScore() : "-") + ")" +
                "\n\nRules:" +
                "\n1. Format your responses in clean Markdown." +
                "\n2. Never provide direct stock market tips (e.g., 'Buy Reliance'). Suggest broader asset classes (e.g., Index Funds, FDs)." +
                "\n3. Keep your answers relatively short and highly actionable.";
    }

    public Flux<String> streamChat(User user, String userMessage) {
        // Save user message
        saveMessage(user, "user", userMessage);

        FinancialScore score = financialScoreService.getLatestScore(user);
        String systemInstruction = buildSystemInstruction(user, score);

        // Fetch last 10 messages for context
        List<ChatMessage> history = chatHistoryRepository.findRecentMessagesByUserId(user.getId(), PageRequest.of(0, 10));
        Collections.reverse(history);

        List<Map<String, Object>> contents = new ArrayList<>();
        
        for (ChatMessage msg : history) {
            contents.add(Map.of(
                "role", msg.getRole(),
                "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }

        // Prepare request body
        Map<String, Object> requestBody = Map.of(
            "systemInstruction", Map.of(
                "parts", List.of(Map.of("text", systemInstruction))
            ),
            "contents", contents
        );

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(":streamGenerateContent")
                        .queryParam("key", apiKey)
                        .queryParam("alt", "sse")
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToFlux(String.class)
                .map(this::extractTextFromGeminiResponse)
                .filter(text -> !text.isEmpty())
                // Collect the entire response and save it when the stream completes
                .publish().autoConnect()
                .transform(flux -> {
                    StringBuilder fullResponse = new StringBuilder();
                    return flux.doOnNext(fullResponse::append)
                               .doOnComplete(() -> saveMessage(user, "model", fullResponse.toString()));
                });
    }

    private String extractTextFromGeminiResponse(String jsonChunk) {
        try {
            JsonNode root = objectMapper.readTree(jsonChunk);
            JsonNode parts = root.path("candidates").path(0).path("content").path("parts");
            if (parts.isArray() && parts.size() > 0) {
                return parts.get(0).path("text").asText("");
            }
        } catch (Exception e) {
            // Log error, skip chunk
        }
        return "";
    }

    private void saveMessage(User user, String role, String content) {
        if (content == null || content.trim().isEmpty()) return;
        ChatMessage msg = ChatMessage.builder()
                .user(user)
                .role(role)
                .content(content)
                .tokensUsed(0)
                .build();
        chatHistoryRepository.save(msg);
    }

    public List<ChatMessage> getHistory(User user) {
        return chatHistoryRepository.findRecentMessagesByUserId(user.getId(), PageRequest.of(0, 20));
    }
    
    public void clearHistory(User user) {
        chatHistoryRepository.deleteByUserId(user.getId());
    }

    public String generateDailyTip(User user) {
        FinancialScore score = financialScoreService.getLatestScore(user);
        String prompt = "Give me one single sentence of actionable personal finance advice based on my current score of " + score.getOverallScore() + "/100. Do not use formatting.";
        
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", prompt))
            ))
        );

        try {
            String response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(":generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
                
            return extractTextFromGeminiResponse(response);
        } catch (Exception e) {
            return "Keep tracking your expenses to build a strong financial foundation!";
        }
    }
}
