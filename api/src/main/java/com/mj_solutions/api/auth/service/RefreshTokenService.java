package com.mj_solutions.api.auth.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.entity.RefreshToken;
import com.mj_solutions.api.auth.exception.RefreshTokenException;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;
	private final ApplicationUserRepository userRepository;

	@Value("${app.jwtRefreshExpirationMs:604800000}") // 7 jours par défaut
	private Long refreshTokenDurationMs;

	public RefreshToken createRefreshToken(ApplicationUser user) {
		RefreshToken token = RefreshToken.builder()
				.user(user)
				.token(UUID.randomUUID().toString())
				.expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
				.build();

		return refreshTokenRepository.save(token);
	}

	public RefreshToken verifyExpiration(RefreshToken token) {
		if (token.getExpiryDate().isBefore(Instant.now())) {
			refreshTokenRepository.delete(token);
			throw new RefreshTokenException(token.getToken(), "Refresh token expired");
		}
		return token;
	}

	@Transactional
	public int deleteByUserId(Long userId) {
		ApplicationUser user = userRepository.findById(userId).orElseThrow();
		return refreshTokenRepository.deleteByUser(user);
	}
}
