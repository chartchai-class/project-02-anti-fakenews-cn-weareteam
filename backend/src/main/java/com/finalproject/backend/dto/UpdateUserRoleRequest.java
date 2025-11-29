package com.finalproject.backend.dto;

import com.finalproject.backend.domain.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleRequest {
    @NotNull private Role role;
}

