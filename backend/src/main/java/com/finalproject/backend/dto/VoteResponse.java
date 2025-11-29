package com.finalproject.backend.dto;

import lombok.Data;

@Data
public class VoteResponse {
    private Long id;
    private boolean value;
    private String commentText;
    private String imageUrl;
    private String voterName;
    private java.time.Instant createdAt;
}
