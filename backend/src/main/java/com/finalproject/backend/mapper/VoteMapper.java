package com.finalproject.backend.mapper;

import com.finalproject.backend.domain.Vote;
import com.finalproject.backend.dto.VoteResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VoteMapper {
    @Mapping(target = "voterName", expression = "java(v.getVoter()!=null ? v.getVoter().getFirstName() + \" \" + v.getVoter().getLastName() : \"Anonymous\")")
    @Mapping(target = "createdAt", expression = "java(v.getCreatedAt() != null ? v.getCreatedAt() : java.time.Instant.EPOCH)")
    VoteResponse toResponse(Vote v);
}
