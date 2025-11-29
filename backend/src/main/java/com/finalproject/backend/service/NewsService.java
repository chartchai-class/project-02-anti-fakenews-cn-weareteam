package com.finalproject.backend.service;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.NewsStatus;
import com.finalproject.backend.domain.User;
import com.finalproject.backend.repo.NewsRepository;
import com.finalproject.backend.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    public Page<News> list(NewsStatus status, String q, Pageable pageable) {
        if (q != null && !q.isBlank()) {
            String lq = q.trim().toLowerCase();
            if (status != null) {
                return newsRepository.searchWithStatus(q, status, pageable);
            }
            if (lq.equals("fake")) return newsRepository.findByDeletedFalseAndStatus(NewsStatus.FAKE, pageable);
            if (lq.equals("real") || lq.equals("not fake") || lq.equals("not_fake")) return newsRepository.findByDeletedFalseAndStatus(NewsStatus.REAL, pageable);
            if (lq.equals("unverified")) return newsRepository.findByDeletedFalseAndStatus(NewsStatus.UNVERIFIED, pageable);
            return newsRepository.search(q, pageable);
        }
        if (status != null) {
            return newsRepository.findByDeletedFalseAndStatus(status, pageable);
        }
        return newsRepository.findByDeletedFalse(pageable);
    }

    public Page<News> listAdmin(String q, Pageable pageable) {
        if (q != null && !q.isBlank()) {
            return newsRepository.searchAll(q, pageable);
        }
        return newsRepository.findAll(pageable);
    }

    public News create(User reporterRef, String title, String summary, String imageUrl) {
        User reporter = userRepository.findByEmail(reporterRef.getEmail()).orElseThrow();
        News n = News.builder()
                .title(title)
                .summary(summary)
                .imageUrl(imageUrl)
                .reporter(reporter)
                .status(NewsStatus.UNVERIFIED)
                .build();
        return newsRepository.save(n);
    }

    public News get(Long id) { return newsRepository.findById(id).orElseThrow(); }

    public void softDelete(Long id) {
        News n = newsRepository.findById(id).orElseThrow();
        n.setDeleted(true);
        newsRepository.save(n);
    }

    public void restore(Long id) {
        News n = newsRepository.findById(id).orElseThrow();
        n.setDeleted(false);
        newsRepository.save(n);
    }

    public News setStatus(Long id, NewsStatus status) {
        News n = newsRepository.findById(id).orElseThrow();
        n.setStatus(status);
        return newsRepository.save(n);
    }
}
