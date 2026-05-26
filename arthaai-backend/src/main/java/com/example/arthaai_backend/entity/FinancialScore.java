package com.example.arthaai_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "financial_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    private Integer overallScore;
    private Integer savingsRatioScore;
    private Integer debtRatioScore;
    private Integer emergencyFundScore;
    private Integer investmentScore;
    private Integer insuranceScore;

    private String aiCommentary;

    @CreationTimestamp
    private Instant calculatedAt;
}
