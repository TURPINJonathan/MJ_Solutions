package com.mj_solutions.api.auth.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.dto.LoginRequest;
import com.mj_solutions.api.auth.dto.LoginResponse;
import com.mj_solutions.api.auth.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final ApplicationUserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;
	private final RefreshTokenService refreshTokenService;

	public LoginResponse login(LoginRequest request) {
		ApplicationUser user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BadCredentialsException("Invalid credentials");
		}

		refreshTokenService.deleteByUserId(user.getId());
		
		String accessToken = jwtUtils.generateJwtToken(user.getEmail());
		String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

		return new LoginResponse(accessToken, refreshToken);
	}

}
