package com.mj_solutions.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mj_solutions.api.model.ApplicationUser;
import com.mj_solutions.api.model.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Optional<RefreshToken> findByToken(String token);

	int deleteByUser(ApplicationUser user);
}
