package com.mj_solutions.api.unit.auth.entity;

import static org.assertj.core.api.Assertions.*;

import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.auth.entity.BlacklistedToken;

class BlacklistedTokenTest {

	@Test
	void testGettersAndSetters() {
		BlacklistedToken token = new BlacklistedToken();
		token.setId(99L);
		token.setToken("jwt-token");
		token.setExpiryDate(Instant.parse("2025-06-17T21:00:00Z"));

		assertThat(token.getId()).isEqualTo(99L);
		assertThat(token.getToken()).isEqualTo("jwt-token");
		assertThat(token.getExpiryDate()).isEqualTo(Instant.parse("2025-06-17T21:00:00Z"));
	}

	@Test
	void testAllArgsConstructorAndBuilder() {
		Instant expiry = Instant.now();
		BlacklistedToken token = BlacklistedToken.builder()
				.id(2L)
				.token("blacklisted")
				.expiryDate(expiry)
				.build();

		assertThat(token.getId()).isEqualTo(2L);
		assertThat(token.getToken()).isEqualTo("blacklisted");
		assertThat(token.getExpiryDate()).isEqualTo(expiry);
	}
}
