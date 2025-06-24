package com.mj_solutions.api.unit.compagny.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CreateCompagnyRequest;
import com.mj_solutions.api.compagny.dto.UpdateCompagnyRequest;
import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.repository.CompagnyImageRepository;
import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.compagny.service.CompagnyService;
import com.mj_solutions.api.file.repository.FileRepository;

class CompagnyServiceTest {

	@Mock
	private CompagnyRepository compagnyRepository;
	@Mock
	private CompagnyImageRepository compagnyImageRepository;
	@Mock
	private FileRepository fileRepository;

	@InjectMocks
	private CompagnyService compagnyService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void createCompagny_shouldSaveAndReturnDto() {
		CreateCompagnyRequest req = CreateCompagnyRequest.builder()
				.name("Test")
				.description("desc")
				.color("red")
				.website("site")
				.build();

		Compagny saved = Compagny.builder().id(1L).name("Test").description("desc").color("red").website("site").build();
		when(compagnyRepository.save(any(Compagny.class))).thenReturn(saved);

		CompagnyDto dto = compagnyService.createCompagny(req);

		assertThat(dto).isNotNull();
		assertThat(dto.getName()).isEqualTo("Test");
	}

	@Test
	void getCompagny_shouldReturnDto() {
		Compagny compagny = Compagny.builder().id(1L).name("Test").description("desc").color("red").build();
		when(compagnyRepository.findById(1L)).thenReturn(Optional.of(compagny));

		CompagnyDto dto = compagnyService.getCompagny(1L);

		assertThat(dto).isNotNull();
		assertThat(dto.getId()).isEqualTo(1L);
	}

	@Test
	void getCompagny_shouldThrowIfNotFound() {
		when(compagnyRepository.findById(2L)).thenReturn(Optional.empty());
		assertThatThrownBy(() -> compagnyService.getCompagny(2L)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void getAllCompagnies_shouldReturnList() {
		Compagny c1 = Compagny.builder().id(1L).name("A").description("d").color("c").build();
		Compagny c2 = Compagny.builder().id(2L).name("B").description("d2").color("c2").build();
		when(compagnyRepository.findAll()).thenReturn(List.of(c1, c2));

		List<CompagnyDto> list = compagnyService.getAllCompagnies();

		assertThat(list).hasSize(2);
	}

	@Test
	void updateCompagny_shouldUpdateFields() {
		Compagny compagny = Compagny.builder().id(1L).name("Old").description("desc").color("red").build();
		when(compagnyRepository.findById(1L)).thenReturn(Optional.of(compagny));
		when(compagnyRepository.save(any(Compagny.class))).thenReturn(compagny);

		UpdateCompagnyRequest req = UpdateCompagnyRequest.builder().name("NewName").build();

		CompagnyDto dto = compagnyService.updateCompagny(1L, req);

		assertThat(dto.getName()).isEqualTo("NewName");
	}

	@Test
	void deleteCompagny_shouldSetDeletedAt() {
		Compagny compagny = Compagny.builder().id(1L).name("A").build();
		when(compagnyRepository.findById(1L)).thenReturn(Optional.of(compagny));

		compagnyService.deleteCompagny(1L);

		assertThat(compagny.getDeletedAt()).isNotNull();
		verify(compagnyRepository).save(compagny);
	}
}