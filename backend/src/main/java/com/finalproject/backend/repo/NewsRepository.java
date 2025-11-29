package com.finalproject.backend.repo;

import com.finalproject.backend.domain.News;
import com.finalproject.backend.domain.NewsStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NewsRepository extends JpaRepository<News, Long> {
    Page<News> findByDeletedFalse(Pageable pageable);
    Page<News> findByDeletedFalseAndStatus(NewsStatus status, Pageable pageable);

    @Query("select n from News n where n.deleted=false and (" +
            "lower(n.title) like lower(concat('%',:q,'%')) or " +
            "lower(n.summary) like lower(concat('%',:q,'%')) or " +
            "(n.reporter is not null and lower(concat(n.reporter.firstName,' ',n.reporter.lastName)) like lower(concat('%',:q,'%'))) )")
    Page<News> search(@Param("q") String q, Pageable pageable);

    @Query("select n from News n where n.deleted=false and n.status = :status and (" +
            "lower(n.title) like lower(concat('%',:q,'%')) or " +
            "lower(n.summary) like lower(concat('%',:q,'%')) or " +
            "(n.reporter is not null and lower(concat(n.reporter.firstName,' ',n.reporter.lastName)) like lower(concat('%',:q,'%'))) )")
    Page<News> searchWithStatus(@Param("q") String q, @Param("status") NewsStatus status, Pageable pageable);

    @Query("select n from News n where " +
            "lower(n.title) like lower(concat('%',:q,'%')) or " +
            "lower(n.summary) like lower(concat('%',:q,'%')) or " +
            "(n.reporter is not null and lower(concat(n.reporter.firstName,' ',n.reporter.lastName)) like lower(concat('%',:q,'%')))")
    Page<News> searchAll(@Param("q") String q, Pageable pageable);
}
