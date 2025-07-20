package com.mj_solutions.api.functional.project;

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
import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.file.dto.FileDto;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.project.dto.CreateProjectRequest;
import com.mj_solutions.api.project.dto.ProjectDeveloperRole;
import com.mj_solutions.api.project.dto.ProjectDto;
import com.mj_solutions.api.project.dto.ProjectMediaDto;
import com.mj_solutions.api.project.dto.ProjectStatus;
import com.mj_solutions.api.project.dto.UpdateProjectRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.entity.Technology;
import com.mj_solutions.api.technology.repository.TechnologyRepository;
import com.mj_solutions.api.util.TestAuthUtil;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ProjectCrudITTest {

	@Autowired
	private TestRestTemplate restTemplate;

	@Autowired
	private FileRepository fileRepository;

	@Autowired
	private TechnologyRepository technologyRepository;

	@Autowired
	private CompagnyRepository compagnyRepository;

	@Autowired
	private ApplicationUserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private TestAuthUtil testAuthUtil;

	private String jwtToken;
	private Long fileId;
	private Long techId;
	private Long compagnyId;
	private final String adminEmail = "admin@mj.com";
	private final String adminPassword = "1234Test!";

	@BeforeEach
	void setup() {
		testAuthUtil.ensureAdminUser(userRepository, passwordEncoder, adminEmail, adminPassword);
		this.jwtToken = testAuthUtil.obtainJwtToken(restTemplate, adminEmail, adminPassword);

		File file = fileRepository.findAll().stream().findFirst().orElseGet(() -> {
			File f = new File();
			f.setFilename("project_test.png");
			f.setName("project_test");
			f.setOriginalFilename("project_test.png");
			f.setContentType("image/png");
			f.setCompressedData(new byte[] { 1, 2, 3 });
			f.setOriginalSize(3L);
			f.setCreatedAt(LocalDateTime.now());
			return fileRepository.save(f);
		});
		fileId = file.getId();

		Technology tech = technologyRepository.findAll().stream().findFirst().orElseGet(() -> {
			Technology t = Technology.builder()
					.name("TechForProject")
					.description("desc")
					.proficiency(80)
					.documentationUrl("https://tech.com")
					.color("#123456")
					.types(List.of())
					.isFavorite(true)
					.build();
			return technologyRepository.save(t);
		});
		techId = tech.getId();

		Compagny compagny = compagnyRepository.findAll().stream().findFirst().orElseGet(() -> {
			Compagny c = Compagny.builder()
					.name("CompagnyForProject")
					.description("Compagny description")
					.color("#123456")
					.type(CompagnyType.CDI)
					.build();
			return compagnyRepository.save(c);
		});
		compagnyId = compagny.getId();
	}

	private HttpHeaders authHeaders() {
		return testAuthUtil.authHeaders(jwtToken);
	}

	@Test
	void project_crud_flow_with_media_and_relations() {
		// 1. CREATE
		FileDto picture = FileDto.builder().id(fileId).filename("project_test.png").build();
		TechnologyDto techDto = TechnologyDto.builder().id(techId).name("TechForProject").build();
		CompagnyDto compagnyDto = CompagnyDto.builder().id(compagnyId).name("CompagnyForProject").build();

		ProjectMediaDto media = ProjectMediaDto.builder()
				.picture(List.of(picture))
				.video(List.of())
				.build();

		CreateProjectRequest createReq = CreateProjectRequest.builder()
				.title("TestProject")
				.slug("test-project")
				.description("desc")
				.status(ProjectStatus.PUBLISHED)
				.technologies(List.of(techDto))
				.companies(List.of(compagnyDto))
				.media(media)
				.developerRoles(List.of(ProjectDeveloperRole.DEVELOPER))
				.isOnline(true)
				.build();

		HttpEntity<CreateProjectRequest> createEntity = new HttpEntity<>(createReq, authHeaders());
		ResponseEntity<ProjectDto> createResp = restTemplate.postForEntity("/project/create", createEntity,
				ProjectDto.class);
		assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		ProjectDto created = createResp.getBody();
		assertThat(created).isNotNull();
		Long projectId = created != null ? created.getId() : null;
		assertThat(projectId).isNotNull();
		assertThat(created.getTitle()).isEqualTo("TestProject");
		assertThat(created.getTechnologies()).isNotEmpty();
		assertThat(created.getCompanies()).isNotEmpty();
		assertThat(created.getMedia()).isNotNull();
		assertThat(created.getMedia().getPicture()).isNotEmpty();

		// 2. READ
		ResponseEntity<ProjectDto[]> getResp = restTemplate.getForEntity("/project/all", ProjectDto[].class);
		assertThat(getResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(getResp.getBody()).isNotNull();
		assertThat(List.of(getResp.getBody()).stream().anyMatch(p -> p.getId().equals(projectId))).isTrue();

		// 3. UPDATE
		UpdateProjectRequest updateReq = UpdateProjectRequest.builder()
				.title("ProjectUpdated")
				.status(ProjectStatus.ARCHIVED)
				.build();

		HttpEntity<UpdateProjectRequest> updateEntity = new HttpEntity<>(updateReq, authHeaders());
		ResponseEntity<ProjectDto> updateResp = restTemplate.exchange(
				"/project/update/" + projectId, HttpMethod.PATCH, updateEntity, ProjectDto.class);
		assertThat(updateResp.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(updateResp.getBody().getTitle()).isEqualTo("ProjectUpdated");
		assertThat(updateResp.getBody().getStatus()).isEqualTo(ProjectStatus.ARCHIVED);

		// 4. DELETE
		HttpEntity<Void> deleteEntity = new HttpEntity<>(authHeaders());
		ResponseEntity<Void> deleteResp = restTemplate.exchange(
				"/project/delete/" + projectId, HttpMethod.DELETE, deleteEntity, Void.class);
		assertThat(deleteResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

		// 5. READ DELETED
		ResponseEntity<ProjectDto[]> getDeleted = restTemplate.getForEntity("/project/all?includeDeleted=true",
				ProjectDto[].class);
		assertThat(getDeleted.getStatusCode()).isEqualTo(HttpStatus.OK);
		assertThat(
				List.of(getDeleted.getBody()).stream().anyMatch(p -> p.getId().equals(projectId) && p.getDeletedAt() != null))
				.isTrue();
	}
}