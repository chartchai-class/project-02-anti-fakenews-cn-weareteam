package com.finalproject.backend.dto;

import com.finalproject.backend.domain.NewsStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateNewsStatusRequest {
    @NotNull private NewsStatus status;
}

