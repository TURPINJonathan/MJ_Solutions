package com.mj_solutions.api.unit.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.dto.LoginRequest;
import com.mj_solutions.api.auth.dto.LoginResponse;
import com.mj_solutions.api.auth.entity.RefreshToken;
import com.mj_solutions.api.auth.security.JwtUtils;
import com.mj_solutions.api.auth.service.AuthService;
import com.mj_solutions.api.auth.service.RefreshTokenService;

class AuthServiceTest {

	@Mock
	private ApplicationUserRepository userRepository;
	@Mock
	private BCryptPasswordEncoder passwordEncoder;
	@Mock
	private JwtUtils jwtUtils;
	@Mock
	private RefreshTokenService refreshTokenService;

	@InjectMocks
	private AuthService authService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void login_shouldReturnTokens_whenCredentialsAreValid() {
		LoginRequest request = new LoginRequest("test@mail.com", "password");
		ApplicationUser user = new ApplicationUser();
		user.setEmail("test@mail.com");
		user.setPassword("hashed");

		when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("password", "hashed")).thenReturn(true);
		when(jwtUtils.generateJwtToken("test@mail.com")).thenReturn("access-token");

		RefreshToken refreshToken = mock(RefreshToken.class);
		when(refreshToken.getToken()).thenReturn("refresh-token");
		when(refreshTokenService.createRefreshToken(user)).thenReturn(refreshToken);

		LoginResponse response = authService.login(request);

		assertEquals("access-token", response.getToken());
		assertEquals("refresh-token", response.getRefreshToken());
	}

	@Test
	void login_shouldThrowBadCredentialsException_whenPasswordIsInvalid() {
		LoginRequest request = new LoginRequest("test@mail.com", "wrong");
		ApplicationUser user = new ApplicationUser();
		user.setEmail("test@mail.com");
		user.setPassword("hashed");

		when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

		assertThrows(BadCredentialsException.class, () -> authService.login(request));
	}

	@Test
	void login_shouldThrowRuntimeException_whenUserNotFound() {
		LoginRequest request = new LoginRequest("notfound@mail.com", "password");
		when(userRepository.findByEmail("notfound@mail.com")).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> authService.login(request));
	}

	@Test
	void login_shouldReturnTokens_whenCredentialsAreValid_andRefreshTokenMock() {
		LoginRequest request = new LoginRequest("test@mail.com", "password");
		ApplicationUser user = new ApplicationUser();
		user.setEmail("test@mail.com");
		user.setPassword("hashed");

		when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("password", "hashed")).thenReturn(true);
		when(jwtUtils.generateJwtToken("test@mail.com")).thenReturn("access-token");

		AuthServiceTest.RefreshTokenMock refreshToken = new AuthServiceTest.RefreshTokenMock("refresh-token");
		when(refreshTokenService.createRefreshToken(user)).thenReturn(refreshToken);

		LoginResponse response = authService.login(request);

		assertEquals("access-token", response.getToken());
		assertEquals("refresh-token", response.getRefreshToken());
	}

	static class RefreshTokenMock extends RefreshToken {
		private final String token;

		RefreshTokenMock(String token) {
			this.token = token;
		}

		@Override
		public String getToken() {
			return token;
		}
	}
}
