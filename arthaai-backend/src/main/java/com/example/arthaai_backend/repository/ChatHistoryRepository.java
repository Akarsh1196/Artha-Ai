package com.example.arthaai_backend.repository;

import com.example.arthaai_backend.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatMessage, UUID> {
    
    @Query("SELECT c FROM ChatMessage c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    List<ChatMessage> findRecentMessagesByUserId(UUID userId, Pageable pageable);
    
    void deleteByUserId(UUID userId);
}
