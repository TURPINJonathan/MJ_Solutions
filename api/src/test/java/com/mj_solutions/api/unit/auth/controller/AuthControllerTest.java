package com.mj_solutions.api.unit.auth.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mj_solutions.api.applicationuser.dto.UserResponse;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.controller.AuthController;
import com.mj_solutions.api.auth.dto.LoginRequest;
import com.mj_solutions.api.auth.dto.LoginResponse;
import com.mj_solutions.api.auth.security.JwtUtils;
import com.mj_solutions.api.auth.service.AuthService;
import com.mj_solutions.api.auth.service.BlacklistedService;
import com.mj_solutions.api.config.SecurityConfig;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

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

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void login_shouldReturnTokens_whenCredentialsAreValid() throws Exception {
		LoginRequest request = new LoginRequest("test@mail.com", "password");
		UserResponse userResponse = new UserResponse();
		userResponse.setId(1L);

		LoginResponse response = new LoginResponse("access-token", "refresh-token", userResponse);

		Mockito.when(authService.login(Mockito.any(LoginRequest.class))).thenReturn(response);

		mockMvc.perform(post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").value("access-token"))
				.andExpect(jsonPath("$.refreshToken").value("refresh-token"));
	}

	@Test
	void login_shouldReturn401_whenCredentialsAreInvalid() throws Exception {
		LoginRequest request = new LoginRequest("wrong@mail.com", "badpassword");

		Mockito.when(authService.login(Mockito.any(LoginRequest.class)))
				.thenThrow(new RuntimeException("Invalid credentials"));

		mockMvc.perform(post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf()))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void login_shouldReturn400_whenRequestIsInvalid() throws Exception {
		LoginRequest request = new LoginRequest(null, "password");

		mockMvc.perform(post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf()))
				.andExpect(status().isBadRequest());
	}
}
