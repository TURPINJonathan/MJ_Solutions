package com.mj_solutions.api.unit.auth.dto;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.auth.dto.LoginResponse;

class LoginResponseTest {

	@Test
	void testAllArgsConstructorAndGetters() {
		LoginResponse res = new LoginResponse("access-token", "refresh-token");
		assertThat(res.getToken()).isEqualTo("access-token");
		assertThat(res.getRefreshToken()).isEqualTo("refresh-token");
	}

	@Test
	void testNoArgsConstructorAndSetters() {
		LoginResponse res = new LoginResponse();
		res.setToken("t1");
		res.setRefreshToken("r1");
		assertThat(res.getToken()).isEqualTo("t1");
		assertThat(res.getRefreshToken()).isEqualTo("r1");
	}
}
