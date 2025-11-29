package com.finalproject.backend.dto;

import com.finalproject.backend.domain.NewsStatus;
import lombok.Data;

@Data
public class NewsResponse {
    private Long id;
    private String title;
    private String summary;
    private String imageUrl;
    private String reporterName;
    private NewsStatus status;
    private int realVotes;
    private int fakeVotes;
    private java.time.Instant createdAt;
}
