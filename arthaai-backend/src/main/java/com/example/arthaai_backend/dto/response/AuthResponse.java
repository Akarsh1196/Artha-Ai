package com.example.arthaai_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private UserDto user;

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String fullName;
        private String email;
    }
}
