package com.mj_solutions.api.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mj_solutions.api.common.enums.Role;
import com.mj_solutions.api.dto.LoginRequest;
import com.mj_solutions.api.dto.LoginResponse;
import com.mj_solutions.api.dto.RegisterRequest;
import com.mj_solutions.api.model.ApplicationUser;
import com.mj_solutions.api.repository.ApplicationUserRepository;
import com.mj_solutions.api.security.JwtUtils;
import com.mj_solutions.api.utils.StringUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final ApplicationUserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;

	public String register(RegisterRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			return "Email already taken";
		}

		ApplicationUser user = ApplicationUser.builder()
				.firstname(StringUtils.capitalize(request.getFirstname()))
				.lastname(request.getLastname().toUpperCase())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.build();

		userRepository.save(user);

		return "User registered successfully!";
	}

	public LoginResponse login(LoginRequest request) {
		ApplicationUser user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BadCredentialsException("Invalid credentials");
		}

		String token = jwtUtils.generateJwtToken(user.getEmail());
		return new LoginResponse(token);
	}
}
