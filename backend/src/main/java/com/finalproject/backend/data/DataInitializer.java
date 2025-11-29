package com.finalproject.backend.data;

import com.finalproject.backend.domain.*;
import com.finalproject.backend.repo.NewsRepository;
import com.finalproject.backend.repo.UserRepository;
import com.finalproject.backend.repo.VoteRepository;
import com.finalproject.backend.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final UserRepository userRepository;
    private final NewsRepository newsRepository;
    private final VoteRepository voteRepository;
    private final PasswordEncoder passwordEncoder;
    private final VoteService voteService;

    @Override
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        User admin = userRepository.findByEmail("admin@example.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@example.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build()));
        if (!admin.isEnabled()) { admin.setEnabled(true); userRepository.save(admin); }

        User member = userRepository.findByEmail("jane@example.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .firstName("Jane")
                        .lastName("Reporter")
                        .email("jane@example.com")
                        .passwordHash(passwordEncoder.encode("pass1234"))
                        .role(Role.MEMBER)
                        .enabled(true)
                        .build()));
        if (!member.isEnabled()) { member.setEnabled(true); userRepository.save(member); }

        for (User u : userRepository.findAll()) {
            if (!u.isEnabled()) { u.setEnabled(true); userRepository.save(u); }
        }

        Pattern han = Pattern.compile("[\\u4e00-\\u9fff]");
        for (News n : newsRepository.findAll()) {
            String text = ((n.getTitle() == null ? "" : n.getTitle()) + " " + (n.getSummary() == null ? "" : n.getSummary()));
            if (han.matcher(text).find()) {
                voteRepository.deleteByNews(n);
                newsRepository.delete(n);
            }
        }

        long count = newsRepository.count();
        int target = 60;

        List<String> topics = List.of(
                "City council announces new park initiative",
                "Tech company claims breakthrough in AI ethics",
                "Local sports team wins championship",
                "New study questions dietary guidelines",
                "Celebrity rumored to launch charity fund",
                "Unexpected weather pattern hits coastal area",
                "University publishes findings on mental health",
                "Startup raises seed round for climate tech",
                "Community organizes cleanup event",
                "Traffic reform proposal stirs debate",
                "Public transit expansion receives approval",
                "Researchers develop recyclable battery prototype",
                "Farmers adopt smart irrigation systems",
                "Museum opens modern art exhibition",
                "Scientists release report on ocean warming",
                "City launches open data portal",
                "Neighborhood installs solar-powered lighting",
                "Healthcare startup pilots telemedicine program",
                "Education board updates curriculum standards",
                "Wildlife conservation project shows progress"
        );
        List<String> reasons = List.of(
                "Source seems unreliable",
                "No corroborating articles found",
                "Photo appears edited",
                "Official statement contradicts claim",
                "Trusted outlet reported similar facts",
                "Evidence attached supports authenticity",
                "Witness account conflicts with narrative"
        );

        if (count < target) {
            for (int i = (int) count + 1; i <= target; i++) {
                String title = topics.get(i % topics.size()) + " #" + i;
                String summary = "Short summary for item " + i + ". This is placeholder content to test pagination and listing behavior.";
                String imageUrl = "https://picsum.photos/seed/news-" + i + "/640/360";
                NewsStatus status = (i % 3 == 0) ? NewsStatus.FAKE : (i % 5 == 0) ? NewsStatus.REAL : NewsStatus.UNVERIFIED;
                News n = News.builder()
                        .title(title)
                        .summary(summary)
                        .imageUrl(imageUrl)
                        .reporter(member)
                        .status(status)
                        .build();
                newsRepository.save(n);
            }
        }

        for (News n : newsRepository.findAll()) {
            long existing = voteRepository.countByNewsAndValue(n, true) + voteRepository.countByNewsAndValue(n, false);
            int targetVotes = 5 + (int) ((n.getId() % 8));
            if (existing >= targetVotes) continue;
            int toAdd = targetVotes - (int) existing;
            for (int j = 0; j < toAdd; j++) {
                boolean value = ((j + n.getId()) % 2 == 0);
                String comment = reasons.get((j + (int) (n.getId() % reasons.size())) % reasons.size());
                String img = (j % 4 == 0) ? ("https://picsum.photos/seed/vote-" + n.getId() + "-" + j + "/320/180") : "";
                User voterRef = new User();
                voterRef.setEmail((j % 3 == 0) ? "admin@example.com" : "jane@example.com");
                voteService.cast(voterRef, n, value, comment, img);
            }
        }
    }
}
