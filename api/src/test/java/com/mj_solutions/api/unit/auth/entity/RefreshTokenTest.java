package com.mj_solutions.api.unit.auth.entity;

import static org.assertj.core.api.Assertions.*;

import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.auth.entity.RefreshToken;

class RefreshTokenTest {

	@Test
	void testGettersAndSetters() {
		RefreshToken token = new RefreshToken();
		token.setId(42L);
		token.setToken("abc");
		token.setExpiryDate(Instant.parse("2025-06-17T20:00:00Z"));
		ApplicationUser user = new ApplicationUser();
		user.setId(7L);
		token.setUser(user);

		assertThat(token.getId()).isEqualTo(42L);
		assertThat(token.getToken()).isEqualTo("abc");
		assertThat(token.getExpiryDate()).isEqualTo(Instant.parse("2025-06-17T20:00:00Z"));
		assertThat(token.getUser()).isEqualTo(user);
	}

	@Test
	void testAllArgsConstructorAndBuilder() {
		ApplicationUser user = new ApplicationUser();
		user.setId(1L);
		Instant expiry = Instant.now();
		RefreshToken token = RefreshToken.builder()
				.id(1L)
				.token("tok")
				.user(user)
				.expiryDate(expiry)
				.build();

		assertThat(token.getId()).isEqualTo(1L);
		assertThat(token.getToken()).isEqualTo("tok");
		assertThat(token.getUser()).isEqualTo(user);
		assertThat(token.getExpiryDate()).isEqualTo(expiry);
	}
}
