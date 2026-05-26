package com.example.arthaai_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String passwordHash;

    @Column(length = 50)
    private String oauthProvider;

    private String oauthId;

    private Integer age;

    @Column(length = 100)
    private String occupation;

    @Column(precision = 15, scale = 2)
    private BigDecimal annualIncome;

    @Column(length = 20)
    private String riskAppetite;

    private Boolean isVerified;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
