package com.mj_solutions.api.unit.auth.dto;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.auth.dto.RefreshTokenResponse;

class RefreshTokenResponseTest {

	@Test
	void testAllArgsConstructorAndGetters() {
		RefreshTokenResponse res = new RefreshTokenResponse("access-token", "refresh-token");
		assertThat(res.getAccessToken()).isEqualTo("access-token");
		assertThat(res.getRefreshToken()).isEqualTo("refresh-token");
	}
}
