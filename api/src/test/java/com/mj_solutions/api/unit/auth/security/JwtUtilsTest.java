package com.mj_solutions.api.unit.auth.security;

import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.util.Base64;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.mj_solutions.api.auth.security.JwtUtils;

import io.jsonwebtoken.ExpiredJwtException;

class JwtUtilsTest {

	private JwtUtils jwtUtils;
	private String secret = Base64.getEncoder()
			.encodeToString("supersecretkeysupersecretkey123456supersecretkeysupersecretkey123456".getBytes());
	private int expirationMs = 1000 * 60 * 10;

	@BeforeEach
	void setUp() {
		jwtUtils = new JwtUtils();
		ReflectionTestUtils.setField(jwtUtils, "secret", secret);
		ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", expirationMs);
		jwtUtils.init();
	}

	@Test
	void generateJwtToken_and_extractEmail_shouldWork() {
		String email = "test@mail.com";
		String token = jwtUtils.generateJwtToken(email);

		assertNotNull(token);
		assertEquals(email, jwtUtils.getEmailFromToken(token));
	}

	@Test
	void getExpirationFromToken_shouldReturnFutureDate() {
		String token = jwtUtils.generateJwtToken("test@mail.com");
		Instant expiration = jwtUtils.getExpirationFromToken(token);

		assertTrue(expiration.isAfter(Instant.now()));
	}

	@Test
	void getEmailFromToken_shouldThrowException_whenTokenInvalid() {
		String invalidToken = "invalid.token.value";
		assertThrows(Exception.class, () -> jwtUtils.getEmailFromToken(invalidToken));
	}

	@Test
	void getExpirationFromToken_shouldThrowException_whenTokenExpired() {
		ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000);
		jwtUtils.init();
		String token = jwtUtils.generateJwtToken("test@mail.com");
		assertThrows(ExpiredJwtException.class, () -> jwtUtils.getExpirationFromToken(token));
	}
}