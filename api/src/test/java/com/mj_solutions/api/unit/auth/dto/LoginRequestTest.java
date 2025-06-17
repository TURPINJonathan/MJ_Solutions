package com.mj_solutions.api.unit.auth.dto;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.auth.dto.LoginRequest;

class LoginRequestTest {

	@Test
	void testAllArgsConstructorAndGetters() {
		LoginRequest req = new LoginRequest("user@mail.com", "pass");
		assertThat(req.getEmail()).isEqualTo("user@mail.com");
		assertThat(req.getPassword()).isEqualTo("pass");
	}
}
