package com.saadbaig.fullstackbackend.controller;

import com.saadbaig.fullstackbackend.dto.AuthResponse;
import com.saadbaig.fullstackbackend.dto.LoginRequest;
import com.saadbaig.fullstackbackend.dto.SignupRequest;
import com.saadbaig.fullstackbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest signupRequest) {
        return authService.signup(signupRequest);
    }
    
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }
}