package com.mj_solutions.api.applicationuser.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.dto.RegisterRequest;
import com.mj_solutions.api.common.enums.Role;
import com.mj_solutions.api.utils.StringUtils;

@Service
public class UserService {

	private final ApplicationUserRepository applicationUserRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public UserService(ApplicationUserRepository applicationUserRepository, BCryptPasswordEncoder passwordEncoder) {
		this.applicationUserRepository = applicationUserRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public String register(RegisterRequest request) {
		if (applicationUserRepository.findByEmail(request.getEmail()).isPresent()) {
			return "Email already taken";
		}

		ApplicationUser user = ApplicationUser.builder()
				.firstname(StringUtils.capitalize(request.getFirstname()))
				.lastname(request.getLastname().toUpperCase())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.createdAt(LocalDateTime.now())
				.build();

		applicationUserRepository.save(user);

		return "User registered successfully!";
	}
}
