package com.saadbaig.fullstackbackend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saadbaig.fullstackbackend.controller.AuthenticationException;
import com.saadbaig.fullstackbackend.dto.AuthResponse;
import com.saadbaig.fullstackbackend.dto.LoginRequest;
import com.saadbaig.fullstackbackend.dto.SignupRequest;
import com.saadbaig.fullstackbackend.model.Auth;
import com.saadbaig.fullstackbackend.model.User;
import com.saadbaig.fullstackbackend.repository.AuthRepository;
import com.saadbaig.fullstackbackend.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // This method is now only for admin use
    public AuthResponse signup(SignupRequest signupRequest) {
        // Check if username already exists
        if (authRepository.existsByUsername(signupRequest.getUsername())) {
            throw new AuthenticationException("Username already exists");
        }
        
        // Create new Auth entity
        Auth auth = new Auth();
        auth.setUsername(signupRequest.getUsername());
        auth.setPassword(signupRequest.getPassword()); 
        auth.setRole(signupRequest.getRole()); // Set role from request
        authRepository.save(auth);
        
        // Create user profile
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword());
        user.setRole(signupRequest.getRole()); // Set role from request
        userRepository.save(user);
        
        // Generate response
        AuthResponse response = new AuthResponse("success", "User registered successfully");
        response.setUsername(auth.getUsername());
        response.setRole(auth.getRole());
        response.setToken(generateToken());
        response.setUserId(user.getId()); // Add user ID to response
        
        return response;
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by username
        Auth auth = authRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new AuthenticationException("Invalid username or password"));
        
        // Verify password (simple comparison for demo - use proper hashing in production)
        if (!auth.getPassword().equals(loginRequest.getPassword())) {
            throw new AuthenticationException("Invalid username or password");
        }
        
        // Get user details
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new AuthenticationException("User profile not found"));
        
        // Generate response
        AuthResponse response = new AuthResponse("success", "Login successful");
        response.setUsername(auth.getUsername());
        response.setRole(auth.getRole());
        response.setToken(generateToken());
        response.setUserId(user.getId()); // Add user ID to response
        
        return response;
    }
    
    private String generateToken() {
        // In a real app, use proper JWT token generation
        return UUID.randomUUID().toString();
    }
}