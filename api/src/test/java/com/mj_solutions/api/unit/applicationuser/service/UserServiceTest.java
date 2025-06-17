package com.mj_solutions.api.unit.applicationuser.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.mj_solutions.api.applicationuser.dto.RegisterRequest;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.applicationuser.service.UserService;
import com.mj_solutions.api.auth.repository.RefreshTokenRepository;

class UserServiceTest {

	private ApplicationUserRepository userRepository;
	private BCryptPasswordEncoder passwordEncoder;
	private RefreshTokenRepository refreshTokenRepository;
	private UserService userService;

	@BeforeEach
	void setUp() {
		userRepository = mock(ApplicationUserRepository.class);
		passwordEncoder = mock(BCryptPasswordEncoder.class);
		refreshTokenRepository = mock(RefreshTokenRepository.class);
		userService = new UserService(userRepository, passwordEncoder, refreshTokenRepository);
	}

	@Test
	void register_shouldSaveUser() {
		RegisterRequest req = new RegisterRequest();
		req.setFirstname("Jane");
		req.setLastname("Doe");
		req.setEmail("jane.doe@test.com");
		req.setPassword("password");

		when(userRepository.findByEmail("jane.doe@test.com")).thenReturn(Optional.empty());
		when(passwordEncoder.encode("password")).thenReturn("hashed");

		String result = userService.register(req);

		verify(userRepository).save(Mockito.argThat(u -> u.getEmail().equals("jane.doe@test.com")));
		assertThat(result).isEqualTo("User registered successfully!");
	}
}
