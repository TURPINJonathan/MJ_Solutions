package com.mj_solutions.api.unit.applicationuser.controller;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mj_solutions.api.applicationuser.dto.RegisterRequest;
import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApplicationUserControllerITTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ApplicationUserRepository userRepository;
	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void register_shouldCreateUser() throws Exception {
		RegisterRequest req = new RegisterRequest();
		req.setFirstname("John");
		req.setLastname("Doe");
		req.setEmail("john.doe@test.com");
		req.setPassword("Password1!");

		mockMvc.perform(post("/user/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk());

		ApplicationUser user = userRepository.findByEmail("john.doe@test.com").orElse(null);
		assertThat(user).isNotNull();
		assertThat(user.getFirstname()).isEqualTo("John");
	}
}
