package com.finalproject.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.UUID;

@Service
public class S3ImageStorageService implements ImageStorageService {
    private final S3Client s3;
    private final String bucket;
    private final String endpoint;

    public S3ImageStorageService(
            @Value("${storage.s3.accessKey:}") String accessKey,
            @Value("${storage.s3.secretKey:}") String secretKey,
            @Value("${storage.s3.region}") String region,
            @Value("${storage.s3.bucket}") String bucket,
            @Value("${storage.s3.endpoint}") String endpoint
    ) {
        this.bucket = bucket;
        this.endpoint = endpoint;
        if (accessKey == null || accessKey.isBlank()) {
            this.s3 = null; // 不配置则禁用 S3，交由 Local 存储
        } else {
            S3Configuration s3cfg = S3Configuration.builder().pathStyleAccessEnabled(true).build();
            this.s3 = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                    .endpointOverride(URI.create(endpoint))
                    .serviceConfiguration(s3cfg)
                    .build();
        }
    }

    @Override
    public String upload(MultipartFile file, String keyPrefix) {
        if (s3 == null) return null; // 交由上层回退
        String key = keyPrefix + "/" + UUID.randomUUID() + "/" + file.getOriginalFilename();
        try {
            s3.putObject(PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );
            return endpoint + "/" + bucket + "/" + key;
        } catch (Exception e) {
            return null; // 回退到本地
        }
    }
}
