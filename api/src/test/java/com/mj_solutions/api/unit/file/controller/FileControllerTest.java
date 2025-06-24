package com.mj_solutions.api.unit.file.controller;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mj_solutions.api.applicationuser.entity.ApplicationUser;
import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.common.enums.Role;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FileControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private FileRepository fileRepository;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private ApplicationUserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	private String jwtToken;

	@BeforeEach
	void setUp() throws Exception {
		String email = "test-user@example.com";
		String password = "TestPassword123!";

		Optional<ApplicationUser> userOpt = userRepository.findByEmail(email);
		if (userOpt.isEmpty()) {
			ApplicationUser user = new ApplicationUser();
			user.setEmail(email);
			user.setPassword(passwordEncoder.encode(password));
			user.setFirstname("Test");
			user.setLastname("User");
			user.setRole(Role.ROLE_USER);
			userRepository.save(user);
		}

		String loginJson = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		String response = mockMvc.perform(post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(loginJson))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		JsonNode json = objectMapper.readTree(response);
		jwtToken = "Bearer " + json.get("token").asText();
	}

	@Test
	void upload_shouldCreateFile() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "test.txt", MediaType.TEXT_PLAIN_VALUE, "hello world".getBytes(StandardCharsets.UTF_8));

		mockMvc.perform(multipart("/files/upload")
				.file(file)
				.param("name", "Test file")
				.param("alt", "Alt text")
				.header("Authorization", jwtToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.id").exists())
				.andExpect(jsonPath("$.data.filename").exists())
				.andExpect(jsonPath("$.data.originalFilename").value("test.txt"))
				.andExpect(jsonPath("$.data.name").value("Test file"))
				.andExpect(jsonPath("$.data.alt").value("Alt text"));
	}

	@Test
	void download_shouldReturnFileData() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "test2.txt", MediaType.TEXT_PLAIN_VALUE, "download me".getBytes(StandardCharsets.UTF_8));

		String response = mockMvc.perform(multipart("/files/upload")
				.file(file)
				.param("name", "Download file")
				.header("Authorization", jwtToken))
				.andReturn().getResponse().getContentAsString();

		JsonNode json = objectMapper.readTree(response);
		Long id = json.get("data").get("id").asLong();

		mockMvc.perform(get("/files/" + id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.id").value(id))
				.andExpect(jsonPath("$.data.data").exists());
	}

	@Test
	void update_shouldUpdateFileMetadataAndContent() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "update.txt", MediaType.TEXT_PLAIN_VALUE, "old content".getBytes(StandardCharsets.UTF_8));
		String response = mockMvc.perform(multipart("/files/upload")
				.file(file)
				.param("name", "Old name")
				.header("Authorization", jwtToken))
				.andReturn().getResponse().getContentAsString();
		JsonNode json = objectMapper.readTree(response);
		Long id = json.get("data").get("id").asLong();

		MockMultipartFile newFile = new MockMultipartFile(
				"file", "new.txt", MediaType.TEXT_PLAIN_VALUE, "new content".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/files/update/" + id)
				.file(newFile)
				.param("name", "New name")
				.param("alt", "New alt")
				.with(req -> {
					req.setMethod("PUT");
					return req;
				})
				.header("Authorization", jwtToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.name").value("New name"))
				.andExpect(jsonPath("$.data.alt").value("New alt"))
				.andExpect(jsonPath("$.data.originalFilename").value("new.txt"));
	}

	@Test
	void softDelete_shouldMarkFileAsDeleted() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "delete.txt", MediaType.TEXT_PLAIN_VALUE, "delete me".getBytes(StandardCharsets.UTF_8));
		String response = mockMvc.perform(multipart("/files/upload")
				.file(file)
				.param("name", "To delete")
				.header("Authorization", jwtToken))
				.andReturn().getResponse().getContentAsString();
		JsonNode json = objectMapper.readTree(response);
		Long id = json.get("data").get("id").asLong();

		mockMvc.perform(delete("/files/delete/" + id)
				.header("Authorization", jwtToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true));

		File deleted = fileRepository.findById(id).orElse(null);
		assertThat(deleted).isNotNull();
		assertThat(deleted.getDeletedAt()).isNotNull();
	}

	@Test
	void download_shouldReturnNotFoundForDeletedFile() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "ghost.txt", MediaType.TEXT_PLAIN_VALUE, "ghost".getBytes(StandardCharsets.UTF_8));
		String response = mockMvc.perform(multipart("/files/upload")
				.file(file)
				.param("name", "Ghost")
				.header("Authorization", jwtToken))
				.andReturn().getResponse().getContentAsString();
		JsonNode json = objectMapper.readTree(response);
		Long id = json.get("data").get("id").asLong();

		mockMvc.perform(delete("/files/delete/" + id)
				.header("Authorization", jwtToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/files/" + id))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void upload_shouldReturnBadRequestIfNoName() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "noname.txt", MediaType.TEXT_PLAIN_VALUE, "no name".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/files/upload")
				.file(file)
				.header("Authorization", jwtToken))
				.andExpect(status().isBadRequest());
	}

	@Test
	void download_shouldReturnOkIfNoJwt() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "secret.txt", MediaType.TEXT_PLAIN_VALUE, "secret".getBytes(StandardCharsets.UTF_8));
		String response = mockMvc.perform(multipart("/files/upload")
				.file(file)
				.param("name", "Secret")
				.header("Authorization", jwtToken))
				.andReturn().getResponse().getContentAsString();
		JsonNode json = objectMapper.readTree(response);
		Long id = json.get("data").get("id").asLong();

		mockMvc.perform(get("/files/" + id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true));
	}

	@Test
	void update_shouldReturnNotFoundIfFileDoesNotExist() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file", "notfound.txt", MediaType.TEXT_PLAIN_VALUE, "not found".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/files/update/999999")
				.file(file)
				.param("name", "Not found")
				.with(req -> {
					req.setMethod("PUT");
					return req;
				})
				.header("Authorization", jwtToken))
				.andExpect(status().isNotFound());
	}

	@Test
	void delete_shouldReturnNotFoundIfFileDoesNotExist() throws Exception {
		mockMvc.perform(delete("/files/delete/999999")
				.header("Authorization", jwtToken))
				.andExpect(status().isNotFound());
	}

	@Test
	void download_shouldReturnNotFoundIfFileDoesNotExist() throws Exception {
		mockMvc.perform(get("/files/999999"))
				.andExpect(status().isNotFound());
	}
}