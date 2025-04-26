package com.saadbaig.fullstackbackend.repository;

import com.saadbaig.fullstackbackend.model.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Auth, Long> {
    Optional<Auth> findByUsername(String username);
    boolean existsByUsername(String username);
}