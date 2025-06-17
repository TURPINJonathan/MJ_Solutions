package com.mj_solutions.api.applicationuser.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mj_solutions.api.applicationuser.dto.UserResponse;
import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.service.UserService;
import com.mj_solutions.api.auth.dto.RegisterRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
public class ApplicationUserController {

	private final UserService userService;

	public ApplicationUserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public String register(@Valid @RequestBody RegisterRequest request) {
		return userService.register(request);
	}

	@GetMapping("/profile")
	public UserResponse getCurrentUser(@AuthenticationPrincipal ApplicationUser user) {
		return UserResponse.builder()
				.id(user.getId())
				.firstname(user.getFirstname())
				.lastname(user.getLastname())
				.email(user.getEmail())
				.role(user.getRole())
				.createdAt(user.getCreatedAt())
				.build();
	}
}
