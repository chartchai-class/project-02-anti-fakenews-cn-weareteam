package com.finalproject.backend.controller;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.NewsStatus;
import com.finalproject.backend.domain.User;
import com.finalproject.backend.dto.NewsCreateRequest;
import com.finalproject.backend.dto.NewsResponse;
import com.finalproject.backend.mapper.NewsMapper;
import com.finalproject.backend.service.NewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;
    private final NewsMapper newsMapper;
    private final com.finalproject.backend.service.StorageRoutingService storage;

    @GetMapping
    public Page<NewsResponse> list(@RequestParam(name = "status", required = false) NewsStatus status,
                                   @RequestParam(name = "q", required = false) String q,
                                   @RequestParam(name = "page", defaultValue = "0") int page,
                                   @RequestParam(name = "size", defaultValue = "10") int size) {
        Page<News> p = newsService.list(status, q, PageRequest.of(page, size));
        return p.map(newsMapper::toResponse);
    }

    @GetMapping("/{id}")
    public NewsResponse get(@PathVariable(name = "id") Long id) {
        News n = newsService.get(id);
        if (n.isDeleted()) {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND);
        }
        return newsMapper.toResponse(n);
    }

    @PreAuthorize("hasAnyRole('MEMBER','ADMIN')")
    @PostMapping
    public NewsResponse create(@AuthenticationPrincipal UserDetails principal,
                               @Valid @RequestBody NewsCreateRequest req) {
        User reporter = new User();
        reporter.setEmail(principal.getUsername());
        // 实际加载完整用户对象在服务层处理，这里简化由服务内根据 email 关联
        News n = newsService.create(reporter, req.getTitle(), req.getSummary(), req.getImageUrl());
        return newsMapper.toResponse(n);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name = "id") Long id) {
        newsService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MEMBER','ADMIN')")
    @PostMapping(consumes = {org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE})
    public NewsResponse createWithImage(@AuthenticationPrincipal UserDetails principal,
                                        @RequestPart("data") @Valid NewsCreateRequest req,
                                        @org.springframework.web.bind.annotation.RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        String url = req.getImageUrl();
        if (image != null && !image.isEmpty()) {
            url = storage.upload(image, "news");
        }
        User reporter = new User();
        reporter.setEmail(principal.getUsername());
        News n = newsService.create(reporter, req.getTitle(), req.getSummary(), url);
        return newsMapper.toResponse(n);
    }
}
