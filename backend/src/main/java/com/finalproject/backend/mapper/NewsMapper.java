package com.finalproject.backend.mapper;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.dto.NewsResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NewsMapper {
    @Mapping(target = "reporterName", expression = "java(n.getReporter()!=null ? n.getReporter().getFirstName() + \" \" + n.getReporter().getLastName() : \"\")")
    @Mapping(target = "createdAt", expression = "java(n.getCreatedAt() != null ? n.getCreatedAt() : java.time.Instant.EPOCH)")
    NewsResponse toResponse(News n);
}
