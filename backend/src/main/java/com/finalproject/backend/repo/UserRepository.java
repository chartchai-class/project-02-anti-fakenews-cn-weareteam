package com.finalproject.backend.repo;

import com.finalproject.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("select u from User u where lower(u.firstName) like lower(concat('%',:q,'%')) or lower(u.lastName) like lower(concat('%',:q,'%')) or lower(u.email) like lower(concat('%',:q,'%'))")
    Page<User> search(@Param("q") String q, Pageable pageable);
}
