package com.finalproject.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "votes")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private News news;

    @ManyToOne(optional = false)
    private User voter;

    @Column(nullable = false)
    private boolean value; // true: REAL, false: FAKE

    @Column(length = 2000)
    private String commentText;

    private String imageUrl; // 佐证图片

    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
    }
}

