package com.finalproject.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    String upload(MultipartFile file, String keyPrefix);
}

