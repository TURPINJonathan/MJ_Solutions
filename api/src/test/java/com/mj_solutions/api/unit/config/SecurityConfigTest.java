package com.mj_solutions.api.unit.config;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.mj_solutions.api.auth.security.JwtAuthenticationFilter;
import com.mj_solutions.api.config.SecurityConfig;

class SecurityConfigTest {

	@Test
	void passwordEncoder_shouldReturnBCryptPasswordEncoder() {
		SecurityConfig config = new SecurityConfig(mock(JwtAuthenticationFilter.class));
		assertThat(config.passwordEncoder()).isInstanceOf(BCryptPasswordEncoder.class);
	}
}