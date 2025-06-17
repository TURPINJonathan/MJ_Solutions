package com.mj_solutions.api.unit.auth.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.security.JwtAuthenticationFilter;
import com.mj_solutions.api.auth.security.JwtUtils;
import com.mj_solutions.api.auth.service.BlacklistedService;

class JwtAuthenticationFilterTest {

	@Test
	void doFilter_shouldContinueChain_whenNoToken() throws Exception {
		JwtUtils jwtUtils = mock(JwtUtils.class);
		BlacklistedService blacklistedService = mock(BlacklistedService.class);
		ApplicationUserRepository userRepo = mock(ApplicationUserRepository.class);

		JwtAuthenticationFilter filter = new JwtAuthenticationFilter(
				blacklistedService,
				userRepo,
				jwtUtils);

		MockHttpServletRequest request = new MockHttpServletRequest();
		MockHttpServletResponse response = new MockHttpServletResponse();
		MockFilterChain chain = new MockFilterChain();

		filter.doFilter(request, response, chain);

		assertEquals(200, response.getStatus());
	}
}
