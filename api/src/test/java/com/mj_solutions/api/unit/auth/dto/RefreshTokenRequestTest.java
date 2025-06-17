package com.mj_solutions.api.unit.auth.dto;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.auth.dto.RefreshTokenRequest;

class RefreshTokenRequestTest {

	@Test
	void testSetAndGetRefreshToken() {
		RefreshTokenRequest req = new RefreshTokenRequest();
		req.setRefreshToken("refresh-token");
		assertThat(req.getRefreshToken()).isEqualTo("refresh-token");
	}
}