package com.finalproject.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class LocalImageStorageService implements ImageStorageService {
    private final Path baseDir = Path.of("backend", "uploads");

    @Override
    public String upload(MultipartFile file, String keyPrefix) {
        try {
            Files.createDirectories(baseDir.resolve(keyPrefix));
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path target = baseDir.resolve(keyPrefix).resolve(filename);
            try (FileOutputStream out = new FileOutputStream(target.toFile())) {
                out.write(file.getBytes());
            }
            return "/uploads/" + keyPrefix + "/" + filename;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

