package com.mj_solutions.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mj_solutions.api.dto.LoginRequest;
import com.mj_solutions.api.dto.LoginResponse;
import com.mj_solutions.api.dto.RefreshTokenRequest;
import com.mj_solutions.api.dto.RefreshTokenResponse;
import com.mj_solutions.api.dto.RegisterRequest;
import com.mj_solutions.api.exception.RefreshTokenException;
import com.mj_solutions.api.model.RefreshToken;
import com.mj_solutions.api.repository.RefreshTokenRepository;
import com.mj_solutions.api.security.JwtUtils;
import com.mj_solutions.api.service.AuthService;
import com.mj_solutions.api.service.RefreshTokenService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final RefreshTokenService refreshTokenService;

	private final RefreshTokenRepository refreshTokenRepository;

	private final AuthService authService;

	private final JwtUtils jwtUtils;

	@PostMapping("/register")
	public String register(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request);
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		try {
			LoginResponse response = authService.login(request);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
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
	public ResponseEntity<String> logout(@RequestBody RefreshTokenRequest request) {
		String token = request.getRefreshToken();
		return refreshTokenRepository.findByToken(token)
				.map(RefreshToken::getUser)
				.map(user -> {
					refreshTokenService.deleteByUserId(user.getId());
					return ResponseEntity.ok("User logged out successfully");
				})
				.orElseThrow(() -> new RefreshTokenException(token, "Refresh token not found"));
	}
}
