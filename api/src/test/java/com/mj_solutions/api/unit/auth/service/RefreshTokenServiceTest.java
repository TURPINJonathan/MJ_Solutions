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

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.entity.RefreshToken;
import com.mj_solutions.api.auth.exception.RefreshTokenException;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;
import com.mj_solutions.api.auth.service.RefreshTokenService;

class RefreshTokenServiceTest {

	@Mock
	private RefreshTokenRepository refreshTokenRepository;
	@Mock
	private ApplicationUserRepository userRepository;

	@InjectMocks
	private RefreshTokenService refreshTokenService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		try {
			java.lang.reflect.Field field = RefreshTokenService.class.getDeclaredField("refreshTokenDurationMs");
			field.setAccessible(true);
			field.set(refreshTokenService, 60000L);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	void createRefreshToken_shouldSaveAndReturnToken() {
		ApplicationUser user = new ApplicationUser();
		RefreshToken token = RefreshToken.builder().user(user).token("abc").expiryDate(Instant.now().plusSeconds(1000))
				.build();

		when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(token);

		RefreshToken result = refreshTokenService.createRefreshToken(user);

		assertNotNull(result);
		assertEquals(user, result.getUser());
		assertNotNull(result.getToken());
		assertNotNull(result.getExpiryDate());
	}

	@Test
	void verifyExpiration_shouldThrowExceptionIfExpired() {
		RefreshToken token = RefreshToken.builder()
				.token("expired")
				.expiryDate(Instant.now().minusSeconds(10))
				.build();

		doNothing().when(refreshTokenRepository).delete(token);

		assertThrows(RefreshTokenException.class, () -> refreshTokenService.verifyExpiration(token));
		verify(refreshTokenRepository, times(1)).delete(token);
	}

	@Test
	void verifyExpiration_shouldReturnTokenIfNotExpired() {
		RefreshToken token = RefreshToken.builder()
				.token("valid")
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();

		RefreshToken result = refreshTokenService.verifyExpiration(token);

		assertEquals(token, result);
	}

	@Test
	void deleteByUserId_shouldDeleteTokens() {
		ApplicationUser user = new ApplicationUser();
		user.setId(1L);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(refreshTokenRepository.deleteByUser(user)).thenReturn(1);

		int deleted = refreshTokenService.deleteByUserId(1L);

		assertEquals(1, deleted);
		verify(refreshTokenRepository, times(1)).deleteByUser(user);
	}

	@Test
	void deleteByUserId_shouldThrowIfUserNotFound() {
		when(userRepository.findById(2L)).thenReturn(Optional.empty());

		assertThrows(Exception.class, () -> refreshTokenService.deleteByUserId(2L));
	}
}