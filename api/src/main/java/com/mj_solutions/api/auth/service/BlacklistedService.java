package com.mj_solutions.api.auth.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.mj_solutions.api.auth.entity.BlacklistedToken;
import com.mj_solutions.api.auth.repository.BlacklistedTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlacklistedService {

	private final BlacklistedTokenRepository blacklistedTokenRepository;

	public void blacklistToken(String token, Instant expiry) {
		BlacklistedToken blacklisted = BlacklistedToken.builder()
				.token(token)
				.expiryDate(expiry)
				.build();
		blacklistedTokenRepository.save(blacklisted);
	}

	public boolean isTokenBlacklisted(String token) {
		return blacklistedTokenRepository.findByToken(token).isPresent();
	}
}
