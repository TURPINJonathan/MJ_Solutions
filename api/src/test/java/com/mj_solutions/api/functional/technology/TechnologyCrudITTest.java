package com.mj_solutions.api.functional.technology;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.mj_solutions.api.applicationuser.repository.ApplicationUserRepository;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.technology.dto.CreateTechnologyRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.dto.TechnologyImageDto;
import com.mj_solutions.api.technology.dto.TechnologyType;
import com.mj_solutions.api.technology.dto.UpdateTechnologyRequest;
import com.mj_solutions.api.util.TestAuthUtil;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class TechnologyCrudITTest {

	@Autowired
	private TestRestTemplate restTemplate;

	@Autowired
	private FileRepository fileRepository;

	@Autowired
	private ApplicationUserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private TestAuthUtil testAuthUtil;

	private String jwtToken;
	private Long fileId;
	private final String adminEmail = "admin@mj.com";
	private final String adminPassword = "1234Test!";

	@BeforeEach
	void setup() {
		testAuthUtil.ensureAdminUser(userRepository, passwordEncoder, adminEmail, adminPassword);
		this.jwtToken = testAuthUtil.obtainJwtToken(restTemplate, adminEmail, adminPassword);

		File file = fileRepository.findAll().stream().findFirst().orElseGet(() -> {
			File f = new File();
			f.setFilename("tech_test.png");
			f.setName("tech_test");
			f.setOriginalFilename("tech_test.png");
			f.setContentType("image/png");
			f.setCompressedData(new byte[] { 1, 2, 3 });
			f.setOriginalSize(3L);
			f.setCreatedAt(LocalDateTime.now());
			return fileRepository.save(f);
		});
		fileId = file.getId();
	}

	private HttpHeaders authHeaders() {
		return testAuthUtil.authHeaders(jwtToken);
	}

	@Test
	void technology_crud_flow_with_logo() {
		// 1. CREATE
		TechnologyImageDto logo = TechnologyImageDto.builder()
				.fileId(fileId)
				.fileName("tech_test.png")
				.build();

		CreateTechnologyRequest createReq = CreateTechnologyRequest.builder()
				.name("TestTech")
				.description("desc")
				.proficiency(80)
				.documentationUrl("https://tech.com")
				.color("#123456")
				.logo(logo)
				.types(new TechnologyType[] { TechnologyType.BACKEND, TechnologyType.FRONTEND })
				.isFavorite(true)
				.build();

		HttpEntity<CreateTechnologyRequest> createEntity = new HttpEntity<>(createReq, authHeaders());
		ResponseEntity<TechnologyDto> createResp = restTemplate.postForEntity("/technology/create", createEntity,
				TechnologyDto.class);
		assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		TechnologyDto created = createResp.getBody();
		assertThat(created).isNotNull();
		Long techId = created != null ? created.getId() : null;
		assertThat(techId).isNotNull();
		assertThat(created.getLogo()).isNotNull();
		assertThat(created.getLogo().getFileId()).isEqualTo(fileId);

		// 2. READ
		ResponseEntity<TechnologyDto> getResp = restTemplate.getForEntity("/technology/" + techId, TechnologyDto.class);
		assertThat(getResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		TechnologyDto tech = getResp.getBody();
		assertThat(tech.getName()).isEqualTo("TestTech");
		assertThat(tech.getTypes()).containsExactlyInAnyOrder(TechnologyType.BACKEND, TechnologyType.FRONTEND);
		assertThat(tech.getLogo()).isNotNull();

		// 3. UPDATE
		UpdateTechnologyRequest updateReq = UpdateTechnologyRequest.builder()
				.name("TechUpdated")
				.description("updated desc")
				.proficiency(90)
				.documentationUrl("https://updated.com")
				.color("#654321")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.isFavorite(false)
				.logo(null)
				.build();

		HttpEntity<UpdateTechnologyRequest> updateEntity = new HttpEntity<>(updateReq, authHeaders());
		ResponseEntity<TechnologyDto> updateResp = restTemplate.exchange(
				"/technology/update/" + techId, HttpMethod.PATCH, updateEntity, TechnologyDto.class);
		assertThat(updateResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(updateResp.getBody().getName()).isEqualTo("TechUpdated");
		assertThat(updateResp.getBody().getLogo()).isNull();

		// 4. DELETE
		HttpEntity<Void> deleteEntity = new HttpEntity<>(authHeaders());
		ResponseEntity<Void> deleteResp = restTemplate.exchange(
				"/technology/delete/" + techId, HttpMethod.DELETE, deleteEntity, Void.class);
		assertThat(deleteResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

		// 5. READ DELETED
		ResponseEntity<TechnologyDto> getDeleted = restTemplate.getForEntity("/technology/" + techId, TechnologyDto.class);
		assertThat(getDeleted.getStatusCode().is4xxClientError()
				|| (getDeleted.getBody() != null && getDeleted.getBody().getDeletedAt() != null)).isTrue();
	}
}