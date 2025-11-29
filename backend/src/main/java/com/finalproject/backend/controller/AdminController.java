package com.finalproject.backend.controller;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.NewsStatus;
import com.finalproject.backend.domain.Role;
import com.finalproject.backend.dto.UpdateNewsStatusRequest;
import com.finalproject.backend.dto.UpdateUserRoleRequest;
import com.finalproject.backend.repo.UserRepository;
import com.finalproject.backend.service.NewsService;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final NewsService newsService;
    private final com.finalproject.backend.mapper.NewsMapper mapper;

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable(name = "id") Long id, @Valid @RequestBody UpdateUserRoleRequest req) {
        var u = userRepository.findById(id).orElseThrow();
        u.setRole(req.getRole());
        userRepository.save(u);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public Page<com.finalproject.backend.dto.UserResponse> listUsers(@RequestParam(name = "q", required = false) String q,
                                                                     @RequestParam(name = "page", defaultValue = "0") int page,
                                                                     @RequestParam(name = "size", defaultValue = "10") int size) {
        Page<com.finalproject.backend.domain.User> p;
        Pageable pageable = PageRequest.of(page, size);
        if (q != null && !q.isBlank()) {
            p = userRepository.search(q, pageable);
        } else {
            p = userRepository.findAll(pageable);
        }
        return p.map(u -> new com.finalproject.backend.dto.UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getAvatarUrl(), u.getRole(), u.isEnabled()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> softDeleteNews(@PathVariable(name = "id") Long id) {
        newsService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/news/{id}/restore")
    public ResponseEntity<Void> restoreNews(@PathVariable(name = "id") Long id) {
        newsService.restore(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/news/{id}/status")
    public ResponseEntity<Void> setStatus(@PathVariable(name = "id") Long id, @Valid @RequestBody UpdateNewsStatusRequest req) {
        newsService.setStatus(id, req.getStatus());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/news")
    public Page<com.finalproject.backend.dto.NewsResponse> listAll(@RequestParam(name = "q", required = false) String q,
                                                                  @RequestParam(name = "page", defaultValue = "0") int page,
                                                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        Page<News> p = newsService.listAdmin(q, PageRequest.of(page, size));
        return p.map(this.mapper::toResponse);
    }
}
