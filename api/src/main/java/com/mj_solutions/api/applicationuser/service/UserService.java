package com.mj_solutions.api.applicationuser.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mj_solutions.api.applicationuser.dto.RegisterRequest;
import com.mj_solutions.api.applicationuser.dto.UpdateUserRequest;
import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;
import com.mj_solutions.api.common.enums.Role;
import com.mj_solutions.api.exception.ForbiddenOperationException;
import com.mj_solutions.api.utils.StringUtils;

@Service
public class UserService {

	private final ApplicationUserRepository applicationUserRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	private final RefreshTokenRepository refreshTokenRepository;

	public UserService(
			ApplicationUserRepository applicationUserRepository,
			BCryptPasswordEncoder passwordEncoder,
			RefreshTokenRepository refreshTokenRepository) {
		this.refreshTokenRepository = refreshTokenRepository;
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
				.role(Role.ROLE_USER)
				.createdAt(LocalDateTime.now())
				.build();

		applicationUserRepository.save(user);

		return "User registered successfully!";
	}

	public List<ApplicationUser> getAllUsers(ApplicationUser currentUser, int page, int size) {
		if (currentUser.getRole() != Role.ROLE_ADMIN && currentUser.getRole() != Role.ROLE_SUPER_ADMIN) {
			throw new ForbiddenOperationException("You do not have permission to view all users.");
		}
		Pageable pageable = PageRequest.of(page, size);
		return applicationUserRepository.findAll(pageable).getContent();
	}

	public ApplicationUser updateUser(ApplicationUser user, UpdateUserRequest updateRequest) {
		if (updateRequest.getFirstname() != null) {
			user.setFirstname(updateRequest.getFirstname());
		}
		if (updateRequest.getLastname() != null) {
			user.setLastname(updateRequest.getLastname());
		}
		if (updateRequest.getEmail() != null) {
			user.setEmail(updateRequest.getEmail());
		}

		user.setUpdatedAt(LocalDateTime.now());
		return applicationUserRepository.save(user);
	}

	public ApplicationUser updateUserRole(Long userId, String roleStr) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		ApplicationUser currentUser;
		if (principal instanceof ApplicationUser applicationUser) {
			currentUser = applicationUser;
		} else if (principal instanceof UserDetails userDetails) {
			currentUser = applicationUserRepository.findByEmail(userDetails.getUsername())
					.orElseThrow(() -> new ForbiddenOperationException("Current user not found"));
		} else {
			throw new ForbiddenOperationException("Unauthorized");
		}

		ApplicationUser targetUser = applicationUserRepository.findById(userId)
				.orElseThrow(() -> new ForbiddenOperationException("User not found"));

		Role currentRole = currentUser.getRole();
		Role targetRole = targetUser.getRole();

		if (roleStr == null) {
			throw new ForbiddenOperationException("Role must be provided.");
		}

		Role newRole;
		try {
			newRole = Role.valueOf(roleStr.toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new ForbiddenOperationException("Invalid role value.");
		}

		if (currentRole == Role.ROLE_SUPER_ADMIN) {
			targetUser.setUpdatedAt(LocalDateTime.now());
			targetUser.setRole(newRole);
		} else if (currentRole == Role.ROLE_ADMIN) {
			if (targetRole != Role.ROLE_USER) {
				throw new ForbiddenOperationException("An admin can only change the role of a regular user.");
			}
			if (newRole != Role.ROLE_USER) {
				throw new ForbiddenOperationException("An admin cannot promote a user to admin or super admin.");
			}
			targetUser.setUpdatedAt(LocalDateTime.now());
			targetUser.setRole(newRole);
		} else {
			throw new ForbiddenOperationException("You do not have permission to change a user's role.");
		}

		return applicationUserRepository.save(targetUser);
	}

	@Transactional
	public void deleteUserAndTokens(Long userIdToDelete) {
		refreshTokenRepository.deleteByUserId(userIdToDelete);
		applicationUserRepository.deleteById(userIdToDelete);
	}

	public String deleteUser(Long userId) {
		ApplicationUser userToDelete = applicationUserRepository.findById(userId)
				.orElseThrow(() -> new ForbiddenOperationException("User not found"));

		applicationUserRepository.delete(userToDelete);
		return "User deleted successfully.";
	}
}
