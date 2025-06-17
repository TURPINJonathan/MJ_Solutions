package com.mj_solutions.api.unit.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mj_solutions.api.auth.entity.BlacklistedToken;
import com.mj_solutions.api.auth.repository.BlacklistedTokenRepository;
import com.mj_solutions.api.auth.service.BlacklistedService;

class BlacklistedServiceTest {

	@Mock
	private BlacklistedTokenRepository blacklistedTokenRepository;

	@InjectMocks
	private BlacklistedService blacklistedService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void blacklistToken_shouldSaveBlacklistedToken() {
		String token = "token";
		Instant expiry = Instant.now().plusSeconds(3600);

		blacklistedService.blacklistToken(token, expiry);

		verify(blacklistedTokenRepository, times(1)).save(any(BlacklistedToken.class));
	}

	@Test
	void isTokenBlacklisted_shouldReturnTrueIfPresent() {
		String token = "token";
		when(blacklistedTokenRepository.findByToken(token)).thenReturn(Optional.of(new BlacklistedToken()));

		assertTrue(blacklistedService.isTokenBlacklisted(token));
	}

	@Test
	void isTokenBlacklisted_shouldReturnFalseIfNotPresent() {
		String token = "token";
		when(blacklistedTokenRepository.findByToken(token)).thenReturn(Optional.empty());

		assertFalse(blacklistedService.isTokenBlacklisted(token));
	}
}