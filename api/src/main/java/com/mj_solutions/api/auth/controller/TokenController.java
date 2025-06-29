package com.mj_solutions.api.auth.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mj_solutions.api.auth.dto.RefreshTokenRequest;
import com.mj_solutions.api.auth.dto.RefreshTokenResponse;
import com.mj_solutions.api.auth.entity.RefreshToken;
import com.mj_solutions.api.auth.exception.RefreshTokenException;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;
import com.mj_solutions.api.auth.security.JwtUtils;
import com.mj_solutions.api.auth.service.BlacklistedService;
import com.mj_solutions.api.auth.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TokenController {

	private final RefreshTokenService refreshTokenService;
	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtUtils jwtUtils;
	private final BlacklistedService blacklistService;

	@ExceptionHandler(RefreshTokenException.class)
	public ResponseEntity<String> handleRefreshTokenException(RefreshTokenException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
	}

	@PostMapping("/refresh-token")
	public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
		String requestToken = request.getRefreshToken();

		return refreshTokenRepository.findByToken(requestToken)
				.map(refreshTokenService::verifyExpiration)
				.map(RefreshToken::getUser)
				.map(user -> {
					String newToken = jwtUtils.generateJwtToken(user.getEmail());
					return ResponseEntity.ok(new RefreshTokenResponse(newToken, requestToken));
				})
				.orElseThrow(() -> new RefreshTokenException(requestToken, "Refresh token not found"));
	}

	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout(@RequestBody RefreshTokenRequest request,
			@RequestHeader(value = "Authorization", required = false) String bearer) {
		String token = request.getRefreshToken();

		if (bearer != null && bearer.startsWith("Bearer ")) {
			String accessToken = bearer.substring(7);
			Instant expiry = jwtUtils.getExpirationFromToken(accessToken);
			blacklistService.blacklistToken(accessToken, expiry);
		}

		return refreshTokenRepository.findByToken(token)
				.map(RefreshToken::getUser)
				.map(user -> {
					refreshTokenService.deleteByUserId(user.getId());
					return ResponseEntity.ok().body(
							Map.of("message", "Logged out successfully"));
				})
				.orElseThrow(() -> new RefreshTokenException(token, "Refresh token not found"));
	}
}
