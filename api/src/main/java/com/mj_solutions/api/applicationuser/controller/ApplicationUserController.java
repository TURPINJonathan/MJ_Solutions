package com.mj_solutions.api.applicationuser.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mj_solutions.api.applicationuser.dto.UpdateUserRequest;
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

	@GetMapping("/profile/all")
	@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
	public List<UserResponse> getAllUsers(
			@AuthenticationPrincipal ApplicationUser user,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size) {
		return userService.getAllUsers(user, page, size)
				.stream()
				.map(u -> UserResponse.builder()
						.id(u.getId())
						.firstname(u.getFirstname())
						.lastname(u.getLastname())
						.email(u.getEmail())
						.role(u.getRole())
						.createdAt(u.getCreatedAt())
						.build())
				.toList();
	}

	@PatchMapping("/profile/update")
	public UserResponse updateCurrentUser(
			@AuthenticationPrincipal ApplicationUser user,
			@RequestBody UpdateUserRequest updateRequest) {
		ApplicationUser updatedUser = userService.updateUser(user, updateRequest);
		return UserResponse.builder()
				.id(updatedUser.getId())
				.firstname(updatedUser.getFirstname())
				.lastname(updatedUser.getLastname())
				.email(updatedUser.getEmail())
				.role(updatedUser.getRole())
				.createdAt(updatedUser.getCreatedAt())
				.build();
	}

	@PatchMapping("/profile/update/role/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
	public UserResponse updateUserRole(
			@PathVariable Long id,
			@RequestBody UpdateUserRequest updateRequest) {
		ApplicationUser updatedUser = userService.updateUserRole(id, updateRequest.getRole());
		return UserResponse.builder()
				.id(updatedUser.getId())
				.firstname(updatedUser.getFirstname())
				.lastname(updatedUser.getLastname())
				.email(updatedUser.getEmail())
				.role(updatedUser.getRole())
				.createdAt(updatedUser.getCreatedAt())
				.build();
	}
}
