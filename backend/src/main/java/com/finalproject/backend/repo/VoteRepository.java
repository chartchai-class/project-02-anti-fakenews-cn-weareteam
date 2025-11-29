package com.finalproject.backend.repo;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Page<Vote> findByNews(News news, Pageable pageable);
    long countByNewsAndValue(News news, boolean value);
    void deleteByNews(News news);
}
