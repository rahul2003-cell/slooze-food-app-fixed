package com.slooze.foodapp.controller;

import com.slooze.foodapp.dto.ApiResponse;
import com.slooze.foodapp.dto.LoginRequest;
import com.slooze.foodapp.dto.LoginResponse;
import com.slooze.foodapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid username or password"));
        }
    }
}
