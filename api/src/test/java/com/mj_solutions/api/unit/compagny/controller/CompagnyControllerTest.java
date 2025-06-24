package com.mj_solutions.api.unit.compagny.controller;

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
import com.mj_solutions.api.common.controller.ApiExceptionHandler;
import com.mj_solutions.api.compagny.controller.Compagnycontroller;
import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CreateCompagnyRequest;
import com.mj_solutions.api.compagny.dto.UpdateCompagnyRequest;
import com.mj_solutions.api.compagny.repository.CompagnyImageRepository;
import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.compagny.service.CompagnyService;

class CompagnycontrollerTest {

	@Mock
	private CompagnyService compagnyService;
	@Mock
	private CompagnyRepository compagnyRepository;
	@Mock
	private CompagnyImageRepository compagnyImageRepository;

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		Compagnycontroller controller = new Compagnycontroller(compagnyService, compagnyRepository,
				compagnyImageRepository);
		mockMvc = MockMvcBuilders
				.standaloneSetup(controller)
				.setControllerAdvice(new ApiExceptionHandler())
				.build();
	}

	@Test
	void getAllCompagnies_shouldReturn200() throws Exception {
		when(compagnyService.getAllCompagnies()).thenReturn(List.of(
				CompagnyDto.builder().id(1L).name("A").build()));

		mockMvc.perform(get("/compagny/all"))
				.andExpect(status().isOk());
	}

	@Test
	void getAllCompagnies_shouldReturnErrorIfEmpty() throws Exception {
		when(compagnyService.getAllCompagnies()).thenReturn(List.of());

		mockMvc.perform(get("/compagny/all"))
				.andExpect(status().isUnprocessableEntity());
	}

	@Test
	void getCompagny_shouldReturn200() throws Exception {
		CompagnyDto dto = CompagnyDto.builder().id(1L).name("A").build();
		when(compagnyService.getCompagny(1L)).thenReturn(dto);

		mockMvc.perform(get("/compagny/1"))
				.andExpect(status().isOk());
	}

	@Test
	void createCompagny_shouldReturn201() throws Exception {
		CreateCompagnyRequest req = CreateCompagnyRequest.builder().name("A").build();
		CompagnyDto dto = CompagnyDto.builder().id(1L).name("A").build();
		when(compagnyService.createCompagny(any())).thenReturn(dto);

		mockMvc.perform(post("/compagny/create")
				.contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(req)))
				.andExpect(status().isCreated());
	}

	@Test
	void updateCompagny_shouldReturn200() throws Exception {
		UpdateCompagnyRequest req = UpdateCompagnyRequest.builder().name("B").build();
		CompagnyDto dto = CompagnyDto.builder().id(1L).name("B").build();
		when(compagnyService.updateCompagny(eq(1L), any())).thenReturn(dto);

		mockMvc.perform(patch("/compagny/update/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(req)))
				.andExpect(status().isOk());
	}

	@Test
	void deleteCompagny_shouldReturn204() throws Exception {
		doNothing().when(compagnyService).deleteCompagny(1L);

		mockMvc.perform(delete("/compagny/delete/1"))
				.andExpect(status().isNoContent());
	}
}