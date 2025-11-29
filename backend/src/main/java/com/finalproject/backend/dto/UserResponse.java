package com.finalproject.backend.dto;

import com.finalproject.backend.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String avatarUrl;
    private Role role;
    private boolean enabled;
}

