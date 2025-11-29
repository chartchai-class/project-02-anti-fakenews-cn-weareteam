package com.finalproject.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VoteCreateRequest {
    @NotNull private Boolean value;
    private String commentText;
    private String imageUrl;
}

