package com.mj_solutions.api.functional.auth;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.test.context.ActiveProfiles;

import com.mj_solutions.api.auth.dto.RefreshTokenRequest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {
		com.mj_solutions.api.MjSolutionApiApplication.class, TokenFlowITTest.TestUserConfig.class })
@ActiveProfiles("test")
class TokenFlowITTest {

	@TestConfiguration
	static class TestUserConfig {
		@Bean
		public UserDetailsService userDetailsService() {
			return new InMemoryUserDetailsManager(
					User.withUsername("user@mail.com")
							.password("{noop}password")
							.roles("USER")
							.build());
		}
	}

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void refreshToken_shouldFail_withInvalidToken() {
		RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
		refreshRequest.setRefreshToken("invalid-token");

		ResponseEntity<String> response = restTemplate.postForEntity("/auth/refresh-token", refreshRequest, String.class);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}
}
