package com.mj_solutions.api.util;

import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.auth.dto.LoginRequest;
import com.mj_solutions.api.auth.dto.LoginResponse;

@Component
public class TestAuthUtil {

	public String obtainJwtToken(TestRestTemplate restTemplate, String email, String password) {
		LoginRequest loginRequest = new LoginRequest(email, password);
		ResponseEntity<LoginResponse> loginResp = restTemplate.postForEntity("/auth/login", loginRequest,
				LoginResponse.class);
		if (loginResp.getStatusCode() != HttpStatus.OK || loginResp.getBody() == null) {
			throw new RuntimeException("Unable to obtain JWT token for test user: " + email);
		}
		return loginResp.getBody().getToken();
	}

	public HttpHeaders authHeaders(String jwtToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(jwtToken);
		return headers;
	}

	public void ensureAdminUser(ApplicationUserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
			String email, String password) {
		userRepository.findByEmail(email).ifPresentOrElse(
				user -> {
				},
				() -> {
					ApplicationUser admin = new ApplicationUser();
					admin.setEmail(email);
					admin.setFirstname("Admin");
					admin.setLastname("Test");
					admin.setPassword(passwordEncoder.encode(password));
					admin.setRole(com.mj_solutions.api.common.enums.Role.ROLE_ADMIN);
					userRepository.save(admin);
				});
	}
}