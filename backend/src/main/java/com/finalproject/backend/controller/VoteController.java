package com.finalproject.backend.controller;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.User;
import com.finalproject.backend.dto.VoteCreateRequest;
import com.finalproject.backend.dto.VoteResponse;
import com.finalproject.backend.mapper.VoteMapper;
import com.finalproject.backend.service.NewsService;
import com.finalproject.backend.service.StorageRoutingService;
import com.finalproject.backend.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/news/{newsId}/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;
    private final NewsService newsService;
    private final StorageRoutingService storage;
    private final VoteMapper voteMapper;

    @GetMapping
    public Page<VoteResponse> list(@PathVariable(name = "newsId") Long newsId,
                                   @RequestParam(name = "page", defaultValue = "0") int page,
                                   @RequestParam(name = "size", defaultValue = "10") int size) {
        News n = newsService.get(newsId);
        return voteService.list(n, PageRequest.of(page, size)).map(voteMapper::toResponse);
    }

    @PreAuthorize("hasAnyRole('READER','MEMBER','ADMIN')")
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public VoteResponse cast(@PathVariable(name = "newsId") Long newsId,
                             @AuthenticationPrincipal UserDetails principal,
                             @Valid @RequestPart("data") VoteCreateRequest req,
                             @RequestPart(value = "image", required = false) MultipartFile image) {
        News n = newsService.get(newsId);
        User voter = new User();
        voter.setEmail(principal.getUsername());
        String imageUrl = req.getImageUrl();
        if (image != null && !image.isEmpty()) {
            imageUrl = storage.upload(image, "votes");
        }
        return voteMapper.toResponse(voteService.cast(voter, n, req.getValue(), req.getCommentText(), imageUrl));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{voteId}")
    public void delete(@PathVariable(name = "newsId") Long newsId, @PathVariable(name = "voteId") Long voteId) {
        voteService.delete(voteId);
    }
}
