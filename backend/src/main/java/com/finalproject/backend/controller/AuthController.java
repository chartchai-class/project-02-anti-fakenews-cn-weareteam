package com.finalproject.backend.controller;

import com.finalproject.backend.dto.AuthResponse;
import com.finalproject.backend.dto.LoginRequest;
import com.finalproject.backend.dto.RegisterRequest;
import com.finalproject.backend.security.JwtTokenProvider;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.finalproject.backend.dto.UserResponse;
import com.finalproject.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            userService.register(req.getFirstName(), req.getLastName(), req.getEmail(), req.getPassword(), req.getAvatarUrl());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        String token = tokenProvider.createToken(auth.getName());
        AuthResponse res = new AuthResponse();
        res.setToken(token);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserDetails principal) {
        var u = userService.findByEmail(principal.getUsername()).orElseThrow();
        return new UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getAvatarUrl(), u.getRole(), u.isEnabled());
    }
}
