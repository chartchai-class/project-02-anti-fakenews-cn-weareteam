package com.finalproject.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NewsCreateRequest {
    @NotBlank private String title;
    private String summary;
    private String imageUrl;
}

