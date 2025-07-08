package com.mj_solutions.api.unit.technology.controller;

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
import com.mj_solutions.api.technology.controller.TechnologyController;
import com.mj_solutions.api.technology.dto.CreateTechnologyRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.dto.TechnologyType;
import com.mj_solutions.api.technology.dto.UpdateTechnologyRequest;
import com.mj_solutions.api.technology.service.TechnologyService;

public class TechnologyControllerTest {
	@Mock
	private TechnologyService technologyService;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@BeforeEach
	public void setup() {
		MockitoAnnotations.openMocks(this);
		TechnologyController controller = new TechnologyController(technologyService);

		mockMvc = MockMvcBuilders
				.standaloneSetup(controller)
				.setControllerAdvice(new ApiExceptionHandler())
				.build();

		objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
	}

	@Test
	void getAllTechnologies_shouldReturn200() throws Exception {
		when(technologyService.getAllActiveTechnologies()).thenReturn(List.of(
				TechnologyDto.builder()
						.id(1L)
						.name("Test Technology")
						.description("Test Description")
						.proficiency(54)
						.documentationUrl("http://example.com/docs")
						.color("#FFFFFF")
						.logo(null)
						.types(new TechnologyType[] { TechnologyType.BACKEND, TechnologyType.FRONTEND })
						.isFavorite(true)
						.build()));

		mockMvc.perform(get("/technology/all"))
				.andExpect(status().isOk());
	}

	@Test
	void getTechnologyById_shouldReturn200() throws Exception {
		TechnologyDto dto = TechnologyDto.builder()
				.id(1L)
				.name("Test Technology")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.build();

		when(technologyService.getTechnologyById(1L)).thenReturn(dto);

		mockMvc.perform(get("/technology/1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1L));
	}

	@Test
	void getTechnologyById_shouldReturn400IfNotFound() throws Exception {
		when(technologyService.getTechnologyById(1L))
				.thenThrow(new IllegalArgumentException("Technology not found with ID: 1"));

		mockMvc.perform(get("/technology/1"))
				.andExpect(status().isUnprocessableEntity());
	}

	@Test
	void createTechnology_shouldReturn201() throws Exception {
		CreateTechnologyRequest req = CreateTechnologyRequest.builder()
				.name("Tech")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.build();

		TechnologyDto dto = TechnologyDto.builder()
				.id(1L)
				.name("Tech")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.build();

		when(technologyService.createTechnology(any(CreateTechnologyRequest.class))).thenReturn(dto);

		mockMvc.perform(post("/technology/create")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").value(1L));
	}

	@Test
	void updateTechnology_shouldReturn200() throws Exception {
		UpdateTechnologyRequest req = UpdateTechnologyRequest.builder()
				.name("Updated")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.build();

		TechnologyDto dto = TechnologyDto.builder()
				.id(1L)
				.name("Updated")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.build();

		when(technologyService.updateTechnology(eq(1L), any(UpdateTechnologyRequest.class))).thenReturn(dto);

		mockMvc.perform(patch("/technology/update/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated"));
	}

	@Test
	void updateTechnology_shouldReturn400IfNotFound() throws Exception {
		UpdateTechnologyRequest req = UpdateTechnologyRequest.builder().name("Updated").build();

		when(technologyService.updateTechnology(eq(1L), any(UpdateTechnologyRequest.class)))
				.thenThrow(new IllegalArgumentException("Technology update failed. Please check the request data or ID."));

		mockMvc.perform(patch("/technology/update/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isUnprocessableEntity());
	}

	@Test
	void deleteTechnology_shouldReturn204() throws Exception {
		doNothing().when(technologyService).deleteTechnology(1L);

		mockMvc.perform(delete("/technology/delete/1"))
				.andExpect(status().isNoContent());
	}

	@Test
	void getAllTechnologies_withIncludeDeletedTrue_shouldCallGetAllTechnologies() throws Exception {
		when(technologyService.getAllTechnologies()).thenReturn(List.of());

		mockMvc.perform(get("/technology/all?includeDeleted=true"))
				.andExpect(status().isOk());

		verify(technologyService).getAllTechnologies();
	}

	@Test
	void getAllTechnologies_withIncludeDeletedFalse_shouldCallGetAllActiveTechnologies() throws Exception {
		when(technologyService.getAllActiveTechnologies()).thenReturn(List.of());

		mockMvc.perform(get("/technology/all?includeDeleted=false"))
				.andExpect(status().isOk());

		verify(technologyService).getAllActiveTechnologies();
	}

	@Test
	void getAllTechnologies_withIncludeDeletedFalse_shouldNotReturnDeleted() throws Exception {
		TechnologyDto active = TechnologyDto.builder()
				.id(1L)
				.name("Active")
				.deletedAt(null)
				.build();
		TechnologyDto deleted = TechnologyDto.builder()
				.id(2L)
				.name("Deleted")
				.deletedAt(java.time.LocalDateTime.now())
				.build();

		// Le service ne doit retourner que les actifs
		when(technologyService.getAllActiveTechnologies()).thenReturn(List.of(active, deleted));

		mockMvc.perform(get("/technology/all?includeDeleted=false"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].deletedAt").doesNotExist());
	}

	@Test
	void getAllTechnologies_withIncludeDeletedTrue_canReturnDeleted() throws Exception {
		TechnologyDto active = TechnologyDto.builder()
				.id(1L)
				.name("Active")
				.deletedAt(null)
				.build();
		TechnologyDto deleted = TechnologyDto.builder()
				.id(2L)
				.name("Deleted")
				.deletedAt(java.time.LocalDateTime.now())
				.build();

		when(technologyService.getAllTechnologies()).thenReturn(List.of(active, deleted));

		mockMvc.perform(get("/technology/all?includeDeleted=true"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(1L))
				.andExpect(jsonPath("$[1].id").value(2L))
				.andExpect(jsonPath("$[1].deletedAt").exists());
	}
}