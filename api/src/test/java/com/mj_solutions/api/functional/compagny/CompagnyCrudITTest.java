package com.mj_solutions.api.functional.compagny;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;

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
import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CompagnyType;
import com.mj_solutions.api.compagny.dto.CreateCompagnyRequest;
import com.mj_solutions.api.compagny.dto.UpdateCompagnyRequest;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.util.TestAuthUtil;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class CompagnyCrudITTest {

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
			f.setFilename("test.png");
			f.setName("test");
			f.setOriginalFilename("test.png");
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
	void crud_flow_with_contacts_and_images() {
		// 1. CREATE
		CreateCompagnyRequest.ContactRequest contact = CreateCompagnyRequest.ContactRequest.builder()
				.firstname("John")
				.lastname("Doe")
				.email("john@doe.com")
				.phone("0600000000")
				.position("CEO")
				.pictureId(fileId)
				.build();

		CreateCompagnyRequest.ImageRequest logo = CreateCompagnyRequest.ImageRequest.builder()
				.fileId(fileId)
				.isLogo(true)
				.isMaster(true)
				.build();

		CreateCompagnyRequest createReq = CreateCompagnyRequest.builder()
				.name("TestCompagny")
				.description("desc")
				.color("blue")
				.website("https://test.com")
				.type(CompagnyType.CDI)
				.contractStartAt(LocalDateTime.now())
				.contractEndAt(LocalDateTime.now().plusYears(1))
				.pictures(List.of(logo))
				.contacts(List.of(contact))
				.build();

		HttpEntity<CreateCompagnyRequest> createEntity = new HttpEntity<>(createReq, authHeaders());
		ResponseEntity<CompagnyDto> createResp = restTemplate.postForEntity("/compagny/create", createEntity,
				CompagnyDto.class);
		assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		CompagnyDto created = createResp.getBody();
		assertThat(created).isNotNull();
		Long compagnyId = created != null ? created.getId() : null;
		assertThat(compagnyId).isNotNull();

		// 2. READ
		ResponseEntity<CompagnyDto> getResp = restTemplate.getForEntity("/compagny/" + compagnyId, CompagnyDto.class);
		assertThat(getResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		CompagnyDto compagny = getResp.getBody();
		assertThat(compagny.getName()).isEqualTo("TestCompagny");
		assertThat(compagny.getPictures()).hasSize(1);
		assertThat(compagny.getPictures().get(0).isLogo()).isTrue();
		assertThat(compagny.getContacts()).hasSize(1);
		assertThat(compagny.getContacts().get(0).getFirstname()).isEqualTo("John");

		// 3. UPDATE
		UpdateCompagnyRequest.ContactRequest updatedContact = UpdateCompagnyRequest.ContactRequest.builder()
				.firstname("John")
				.lastname("Doe")
				.email("john@doe.com")
				.phone("0611111111")
				.position("CTO")
				.pictureId(fileId)
				.build();

		UpdateCompagnyRequest updateReq = UpdateCompagnyRequest.builder()
				.name("CompagnyUpdated")
				.contacts(List.of(updatedContact))
				.build();

		HttpEntity<UpdateCompagnyRequest> updateEntity = new HttpEntity<>(updateReq, authHeaders());
		ResponseEntity<CompagnyDto> updateResp = restTemplate.exchange(
				"/compagny/update/" + compagnyId, HttpMethod.PATCH, updateEntity, CompagnyDto.class);
		assertThat(updateResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(updateResp.getBody().getName()).isEqualTo("CompagnyUpdated");
		assertThat(updateResp.getBody().getContacts().get(0).getPosition()).isEqualTo("CTO");

		// 4. DELETE
		HttpEntity<Void> deleteEntity = new HttpEntity<>(authHeaders());
		ResponseEntity<Void> deleteResp = restTemplate.exchange(
				"/compagny/delete/" + compagnyId, HttpMethod.DELETE, deleteEntity, Void.class);
		assertThat(deleteResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

		// 5. READ DELETED
		ResponseEntity<CompagnyDto> getDeleted = restTemplate.getForEntity("/compagny/" + compagnyId, CompagnyDto.class);
		assertThat(getDeleted.getStatusCode().is4xxClientError()
				|| (getDeleted.getBody() != null && getDeleted.getBody().getDeletedAt() != null)).isTrue();
	}
}