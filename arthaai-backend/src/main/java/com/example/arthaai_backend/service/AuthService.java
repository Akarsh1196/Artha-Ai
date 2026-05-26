package com.example.arthaai_backend.service;

import com.example.arthaai_backend.dto.request.LoginRequest;
import com.example.arthaai_backend.dto.request.SignupRequest;
import com.example.arthaai_backend.dto.response.AuthResponse;
import com.example.arthaai_backend.entity.User;
import com.example.arthaai_backend.repository.UserRepository;
import com.example.arthaai_backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getId().toString());

        return new AuthResponse(token, new AuthResponse.UserDto(savedUser.getId(), savedUser.getFullName(), savedUser.getEmail()));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId().toString());

        return new AuthResponse(token, new AuthResponse.UserDto(user.getId(), user.getFullName(), user.getEmail()));
    }
}
