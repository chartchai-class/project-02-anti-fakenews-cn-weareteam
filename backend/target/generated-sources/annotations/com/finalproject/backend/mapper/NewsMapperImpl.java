package com.finalproject.backend.mapper;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.dto.NewsResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T23:36:35+0800",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class NewsMapperImpl implements NewsMapper {

    @Override
    public NewsResponse toResponse(News n) {
        if ( n == null ) {
            return null;
        }

        NewsResponse newsResponse = new NewsResponse();

        newsResponse.setId( n.getId() );
        newsResponse.setTitle( n.getTitle() );
        newsResponse.setSummary( n.getSummary() );
        newsResponse.setImageUrl( n.getImageUrl() );
        newsResponse.setStatus( n.getStatus() );
        newsResponse.setRealVotes( n.getRealVotes() );
        newsResponse.setFakeVotes( n.getFakeVotes() );

        newsResponse.setReporterName( n.getReporter()!=null ? n.getReporter().getFirstName() + " " + n.getReporter().getLastName() : "" );
        newsResponse.setCreatedAt( n.getCreatedAt() != null ? n.getCreatedAt() : java.time.Instant.EPOCH );

        return newsResponse;
    }
}
