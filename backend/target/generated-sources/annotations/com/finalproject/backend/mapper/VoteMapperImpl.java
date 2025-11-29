package com.finalproject.backend.mapper;

import com.finalproject.backend.domain.Vote;
import com.finalproject.backend.dto.VoteResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-28T09:09:58+0800",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class VoteMapperImpl implements VoteMapper {

    @Override
    public VoteResponse toResponse(Vote v) {
        if ( v == null ) {
            return null;
        }

        VoteResponse voteResponse = new VoteResponse();

        voteResponse.setId( v.getId() );
        voteResponse.setValue( v.isValue() );
        voteResponse.setCommentText( v.getCommentText() );
        voteResponse.setImageUrl( v.getImageUrl() );

        voteResponse.setVoterName( v.getVoter()!=null ? v.getVoter().getFirstName() + " " + v.getVoter().getLastName() : "Anonymous" );
        voteResponse.setCreatedAt( v.getCreatedAt() != null ? v.getCreatedAt() : java.time.Instant.EPOCH );

        return voteResponse;
    }
}
