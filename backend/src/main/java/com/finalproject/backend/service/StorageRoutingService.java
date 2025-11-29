package com.finalproject.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageRoutingService implements ImageStorageService {
    private final ImageStorageService s3;
    private final ImageStorageService local;
    private final String provider;

    public StorageRoutingService(S3ImageStorageService s3, LocalImageStorageService local,
                                 @Value("${storage.provider}") String provider) {
        this.s3 = s3; this.local = local; this.provider = provider;
    }

    @Override
    public String upload(MultipartFile file, String keyPrefix) {
        if ("s3".equalsIgnoreCase(provider)) {
            String url = s3.upload(file, keyPrefix);
            if (url != null) return url;
        }
        return local.upload(file, keyPrefix);
    }
}

