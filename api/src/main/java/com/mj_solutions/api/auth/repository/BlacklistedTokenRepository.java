package com.mj_solutions.api.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.auth.entity.BlacklistedToken;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
	Optional<BlacklistedToken> findByToken(String token);
}
