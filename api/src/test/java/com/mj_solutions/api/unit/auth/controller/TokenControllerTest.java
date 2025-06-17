package com.mj_solutions.api.unit.auth.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.controller.TokenController;
import com.mj_solutions.api.auth.dto.RefreshTokenRequest;
import com.mj_solutions.api.auth.entity.RefreshToken;
import com.mj_solutions.api.auth.exception.RefreshTokenException;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;
import com.mj_solutions.api.auth.security.JwtUtils;
import com.mj_solutions.api.auth.service.BlacklistedService;
import com.mj_solutions.api.auth.service.RefreshTokenService;
import com.mj_solutions.api.config.SecurityConfig;

@WebMvcTest(TokenController.class)
@Import(SecurityConfig.class)
class TokenControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private RefreshTokenService refreshTokenService;

	@MockitoBean
	private RefreshTokenRepository refreshTokenRepository;

	@MockitoBean
	private JwtUtils jwtUtils;

	@MockitoBean
	private BlacklistedService blacklistService;

	@MockitoBean
	private ApplicationUserRepository applicationUserRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void refreshToken_shouldReturnNewAccessToken_whenRefreshTokenIsValid() throws Exception {
		ApplicationUser user = new ApplicationUser();
		user.setEmail("test@mail.com");
		RefreshToken refreshToken = RefreshToken.builder()
				.token("refresh-token")
				.user(user)
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();

		when(refreshTokenRepository.findByToken("refresh-token")).thenReturn(Optional.of(refreshToken));
		when(refreshTokenService.verifyExpiration(refreshToken)).thenReturn(refreshToken);
		when(jwtUtils.generateJwtToken("test@mail.com")).thenReturn("new-access-token");

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("refresh-token");

		mockMvc.perform(post("/auth/refresh-token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accessToken").value("new-access-token"))
				.andExpect(jsonPath("$.refreshToken").value("refresh-token"));
	}

	@Test
	void refreshToken_shouldReturn404_whenRefreshTokenNotFound() throws Exception {
		when(refreshTokenRepository.findByToken("notfound")).thenReturn(Optional.empty());

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("notfound");

		mockMvc.perform(post("/auth/refresh-token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isNotFound());
	}

	@Test
	void logout_shouldBlacklistAccessTokenAndDeleteRefreshToken() throws Exception {
		ApplicationUser user = new ApplicationUser();
		user.setId(1L);
		RefreshToken refreshToken = RefreshToken.builder()
				.token("refresh-token")
				.user(user)
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();

		when(refreshTokenRepository.findByToken("refresh-token")).thenReturn(Optional.of(refreshToken));
		when(jwtUtils.getExpirationFromToken("access-token")).thenReturn(Instant.now().plusSeconds(1000));

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("refresh-token");

		mockMvc.perform(post("/auth/logout")
				.header("Authorization", "Bearer access-token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isOk());

		verify(blacklistService, times(1)).blacklistToken(eq("access-token"), any());
		verify(refreshTokenService, times(1)).deleteByUserId(1L);
	}

	@Test
	void logout_shouldReturn404_whenRefreshTokenNotFound() throws Exception {
		when(refreshTokenRepository.findByToken("notfound")).thenReturn(Optional.empty());

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("notfound");

		mockMvc.perform(post("/auth/logout")
				.header("Authorization", "Bearer access-token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isNotFound());
	}

	@Test
	void refreshToken_shouldReturn404_whenRefreshTokenExpired() throws Exception {
		ApplicationUser user = new ApplicationUser();
		user.setEmail("test@mail.com");
		RefreshToken refreshToken = RefreshToken.builder()
				.token("refresh-token")
				.user(user)
				.expiryDate(Instant.now().minusSeconds(1000))
				.build();

		when(refreshTokenRepository.findByToken("refresh-token")).thenReturn(Optional.of(refreshToken));
		when(refreshTokenService.verifyExpiration(refreshToken))
				.thenThrow(new RefreshTokenException("refresh-token", "Refresh token expired"));

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("refresh-token");

		mockMvc.perform(post("/auth/refresh-token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isNotFound());
	}

	@Test
	void logout_shouldWorkWithoutAuthorizationHeader() throws Exception {
		ApplicationUser user = new ApplicationUser();
		user.setId(1L);
		RefreshToken refreshToken = RefreshToken.builder()
				.token("refresh-token")
				.user(user)
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();

		when(refreshTokenRepository.findByToken("refresh-token")).thenReturn(Optional.of(refreshToken));

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("refresh-token");

		mockMvc.perform(post("/auth/logout")
				.header("Authorization", "")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isOk());

		verify(refreshTokenService, times(1)).deleteByUserId(1L);
	}

	@Test
	void logout_shouldReturnError_whenAccessTokenExpired() throws Exception {
		ApplicationUser user = new ApplicationUser();
		user.setId(1L);
		RefreshToken refreshToken = RefreshToken.builder()
				.token("refresh-token")
				.user(user)
				.expiryDate(Instant.now().plusSeconds(1000))
				.build();

		when(refreshTokenRepository.findByToken("refresh-token")).thenReturn(Optional.of(refreshToken));
		when(jwtUtils.getExpirationFromToken("expired-access-token"))
				.thenThrow(new RuntimeException("JWT expired"));

		RefreshTokenRequest request = new RefreshTokenRequest();
		request.setRefreshToken("refresh-token");

		mockMvc.perform(post("/auth/logout")
				.header("Authorization", "Bearer expired-access-token")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))
				.with(csrf())
				.with(user("test@mail.com")))
				.andExpect(status().isInternalServerError());
	}
}