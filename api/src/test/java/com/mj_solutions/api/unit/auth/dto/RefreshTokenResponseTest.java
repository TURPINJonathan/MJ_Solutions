package com.mj_solutions.api.unit.auth.dto;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.applicationuser.dto.UserResponse;
import com.mj_solutions.api.auth.dto.RefreshTokenResponse;
import com.mj_solutions.api.common.enums.Role;

class RefreshTokenResponseTest {

	@Test
	void testAllArgsConstructorAndGetters() {
		UserResponse UserResponse = new UserResponse();
		UserResponse.setId(1L);
		UserResponse.setEmail("test@test.com");
		UserResponse.setFirstname("jean");
		UserResponse.setLastname("dupont");
		UserResponse.setRole(Role.ROLE_USER);
		UserResponse.setCreatedAt(java.time.LocalDateTime.now());
		UserResponse.setUpdatedAt(java.time.LocalDateTime.now());

		RefreshTokenResponse res = new RefreshTokenResponse("access-token", "refresh-token", UserResponse);
		assertThat(res.getAccessToken()).isEqualTo("access-token");
		assertThat(res.getRefreshToken()).isEqualTo("refresh-token");
	}
}
