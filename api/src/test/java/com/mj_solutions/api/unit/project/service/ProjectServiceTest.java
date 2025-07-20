package com.mj_solutions.api.unit.project.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.project.dto.CreateProjectRequest;
import com.mj_solutions.api.project.dto.ProjectDto;
import com.mj_solutions.api.project.dto.ProjectStatus;
import com.mj_solutions.api.project.dto.UpdateProjectRequest;
import com.mj_solutions.api.project.entity.Project;
import com.mj_solutions.api.project.repository.ProjectRepository;
import com.mj_solutions.api.project.service.ProjectService;
import com.mj_solutions.api.technology.repository.TechnologyRepository;

public class ProjectServiceTest {
	@Mock
	private ProjectRepository projectRepository;
	@Mock
	private FileRepository fileRepository;
	@Mock
	private TechnologyRepository technologyRepository;
	@Mock
	private CompagnyRepository compagnyRepository;
	@InjectMocks
	private ProjectService projectService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void createProject_shouldSaveAndReturnDto() {
		CreateProjectRequest req = CreateProjectRequest.builder()
				.title("Test Project")
				.slug("test-project")
				.status(ProjectStatus.PUBLISHED)
				.technologies(List.of())
				.companies(List.of())
				.build();

		Project entity = Project.builder()
				.id(1L)
				.title("Test Project")
				.slug("test-project")
				.status(ProjectStatus.PUBLISHED)
				.technologies(List.of())
				.companies(List.of())
				.build();

		when(projectRepository.save(any(Project.class))).thenReturn(entity);

		ProjectDto dto = projectService.createProject(req);

		assertThat(dto).isNotNull();
		assertThat(dto.getTitle()).isEqualTo("Test Project");
		assertThat(dto.getStatus()).isEqualTo(ProjectStatus.PUBLISHED);
	}

	@Test
	void findAllProjects_shouldReturnList() {
		Project entity = Project.builder().id(1L).title("Test").status(ProjectStatus.PUBLISHED).build();
		when(projectRepository.findAll()).thenReturn(Collections.singletonList(entity));

		List<ProjectDto> list = projectService.findAllProjects();

		assertThat(list).hasSize(1);
		assertThat(list.get(0).getId()).isEqualTo(1L);
	}

	@Test
	void updateProject_shouldUpdateAndReturnDto() {
		UpdateProjectRequest req = UpdateProjectRequest.builder()
				.title("Updated")
				.status(ProjectStatus.ARCHIVED)
				.build();

		Project existing = Project.builder().id(1L).title("Old").status(ProjectStatus.PUBLISHED).build();
		Project updated = Project.builder().id(1L).title("Updated").status(ProjectStatus.ARCHIVED).build();

		when(projectRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(projectRepository.save(any(Project.class))).thenReturn(updated);

		ProjectDto dto = projectService.updateProject(1L, req);

		assertThat(dto).isNotNull();
		assertThat(dto.getTitle()).isEqualTo("Updated");
		assertThat(dto.getStatus()).isEqualTo(ProjectStatus.ARCHIVED);
	}

	@Test
	void updateProject_shouldThrowIfNotFound() {
		UpdateProjectRequest req = UpdateProjectRequest.builder().title("Updated").build();
		when(projectRepository.findById(1L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> projectService.updateProject(1L, req))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Project not found");
	}

	@Test
	void deleteProject_shouldSetDeletedAt() {
		Project project = Project.builder().id(1L).title("Test").deletedAt(null).build();
		when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
		when(projectRepository.save(any(Project.class))).thenReturn(project);

		projectService.deleteProject(1L);

		assertThat(project.getDeletedAt()).isNotNull();
	}

	@Test
	void deleteProject_shouldThrowIfNotFound() {
		when(projectRepository.findById(1L)).thenReturn(Optional.empty());
		assertThatThrownBy(() -> projectService.deleteProject(1L))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Project not found");
	}
}