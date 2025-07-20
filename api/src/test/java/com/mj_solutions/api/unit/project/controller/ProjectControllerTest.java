package com.mj_solutions.api.unit.project.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mj_solutions.api.common.controller.ApiExceptionHandler;
import com.mj_solutions.api.project.controller.ProjectController;
import com.mj_solutions.api.project.dto.CreateProjectRequest;
import com.mj_solutions.api.project.dto.ProjectDto;
import com.mj_solutions.api.project.dto.ProjectStatus;
import com.mj_solutions.api.project.dto.UpdateProjectRequest;
import com.mj_solutions.api.project.service.ProjectService;

public class ProjectControllerTest {
	@Mock
	private ProjectService projectService;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@BeforeEach
	public void setup() {
		MockitoAnnotations.openMocks(this);
		ProjectController controller = new ProjectController(projectService);

		mockMvc = MockMvcBuilders
				.standaloneSetup(controller)
				.setControllerAdvice(new ApiExceptionHandler())
				.build();

		objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
	}

	@Test
	void createProject_shouldReturn200() throws Exception {
		CreateProjectRequest req = CreateProjectRequest.builder()
				.title("Project")
				.status(ProjectStatus.PUBLISHED)
				.build();

		ProjectDto dto = ProjectDto.builder()
				.id(1L)
				.title("Project")
				.status(ProjectStatus.PUBLISHED)
				.build();

		when(projectService.createProject(any(CreateProjectRequest.class))).thenReturn(dto);

		mockMvc.perform(post("/project/create")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1L));
	}

	@Test
	void getAllProjects_shouldReturn200() throws Exception {
		ProjectDto dto = ProjectDto.builder().id(1L).title("Project").status(ProjectStatus.PUBLISHED).build();
		when(projectService.findAllProjects()).thenReturn(List.of(dto));

		mockMvc.perform(get("/project/all"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(1L));
	}

	@Test
	void updateProject_shouldReturn200() throws Exception {
		UpdateProjectRequest req = UpdateProjectRequest.builder().title("Updated").build();
		ProjectDto dto = ProjectDto.builder().id(1L).title("Updated").build();

		when(projectService.updateProject(eq(1L), any(UpdateProjectRequest.class))).thenReturn(dto);

		mockMvc.perform(patch("/project/update/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Updated"));
	}

	@Test
	void updateProject_shouldReturn400IfNotFound() throws Exception {
		UpdateProjectRequest req = UpdateProjectRequest.builder().title("Updated").build();

		when(projectService.updateProject(eq(1L), any(UpdateProjectRequest.class)))
				.thenThrow(new IllegalArgumentException("Project update failed. Please check the request data or ID."));

		mockMvc.perform(patch("/project/update/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isUnprocessableEntity());
	}

	@Test
	void deleteProject_shouldReturn204() throws Exception {
		doNothing().when(projectService).deleteProject(1L);

		mockMvc.perform(delete("/project/delete/1"))
				.andExpect(status().isNoContent());
	}
}