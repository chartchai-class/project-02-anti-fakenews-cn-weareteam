package com.finalproject.backend.service;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.Vote;
import com.finalproject.backend.domain.User;
import com.finalproject.backend.repo.NewsRepository;
import com.finalproject.backend.repo.UserRepository;
import com.finalproject.backend.repo.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    @Transactional
    public Vote cast(User voterRef, News news, boolean value, String commentText, String imageUrl) {
        User voter = userRepository.findByEmail(voterRef.getEmail()).orElseThrow();
        Vote v = Vote.builder()
                .voter(voter)
                .news(news)
                .value(value)
                .commentText(commentText)
                .imageUrl(imageUrl)
                .build();
        Vote saved = voteRepository.save(v);
        recalcNews(news);
        return saved;
    }

    public Page<Vote> list(News news, Pageable pageable) {
        return voteRepository.findByNews(news, pageable);
    }

    @Transactional
    public void delete(Long voteId) {
        Vote v = voteRepository.findById(voteId).orElseThrow();
        News n = v.getNews();
        voteRepository.delete(v);
        recalcNews(n);
    }

    private void recalcNews(News n) {
        long real = voteRepository.countByNewsAndValue(n, true);
        long fake = voteRepository.countByNewsAndValue(n, false);
        n.setRealVotes((int) real);
        n.setFakeVotes((int) fake);
        newsRepository.save(n);
    }
}
