package com.mj_solutions.api.functional.auth;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.controller.AuthController;
import com.mj_solutions.api.auth.dto.LoginRequest;
import com.mj_solutions.api.auth.dto.LoginResponse;
import com.mj_solutions.api.auth.security.JwtUtils;
import com.mj_solutions.api.auth.service.AuthService;
import com.mj_solutions.api.auth.service.BlacklistedService;

@WebMvcTest(AuthController.class)
class AuthFlowITTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AuthService authService;

	@MockitoBean
	private BlacklistedService blacklistedService;

	@MockitoBean
	private ApplicationUserRepository applicationUserRepository;

	@MockitoBean
	private JwtUtils jwtUtils;

	@TestConfiguration
	static class NoCsrfSecurityConfig {
		@Bean
		public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
			http.csrf(csrf -> csrf.disable());
			return http.build();
		}
	}

	@Test
	void login_and_accessProtectedResource() throws Exception {
		when(authService.login(any(LoginRequest.class)))
				.thenReturn(new LoginResponse("fake-jwt-token", "fake-refresh-token"));

		String json = "{\"email\":\"user@mail.com\",\"password\":\"password\"}";
		mockMvc.perform(
				org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.token")
						.value("fake-jwt-token"))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.refreshToken")
						.value("fake-refresh-token"));
	}

	@Test
	void login_shouldFail_withBadCredentials() throws Exception {
		when(authService.login(any(LoginRequest.class))).thenThrow(new RuntimeException("Invalid credentials"));

		String json = "{\"email\":\"user@mail.com\",\"password\":\"wrongpassword\"}";
		mockMvc.perform(
				org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isUnauthorized());
	}
}
