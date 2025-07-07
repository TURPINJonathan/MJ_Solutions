package com.mj_solutions.api.unit.compagny.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CompagnyType;
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
		LocalDateTime now = LocalDateTime.now();
		CreateCompagnyRequest req = CreateCompagnyRequest.builder()
				.name("Test")
				.description("desc")
				.color("red")
				.website("site")
				.type(CompagnyType.CDI)
				.contractStartAt(now)
				.contractEndAt(now.plusYears(1))
				.build();

		Compagny saved = Compagny.builder()
				.id(1L)
				.name("Test")
				.description("desc")
				.color("red")
				.website("site")
				.type(CompagnyType.CDI)
				.contractStartAt(now)
				.contractEndAt(now.plusYears(1))
				.build();
		when(compagnyRepository.save(any(Compagny.class))).thenReturn(saved);

		CompagnyDto dto = compagnyService.createCompagny(req);

		assertThat(dto).isNotNull();
		assertThat(dto.getName()).isEqualTo("Test");
		assertThat(dto.getType()).isEqualTo(CompagnyType.CDI);
		assertThat(dto.getContractStartAt()).isEqualTo(now);
		assertThat(dto.getContractEndAt()).isEqualTo(now.plusYears(1));
	}

	@Test
	void getCompagny_shouldReturnDto() {
		LocalDateTime now = LocalDateTime.now();
		Compagny compagny = Compagny.builder()
				.id(1L)
				.name("Test")
				.description("desc")
				.color("red")
				.type(CompagnyType.FREELANCE)
				.contractStartAt(now)
				.contractEndAt(null)
				.build();
		when(compagnyRepository.findById(1L)).thenReturn(Optional.of(compagny));

		CompagnyDto dto = compagnyService.getCompagny(1L);

		assertThat(dto).isNotNull();
		assertThat(dto.getId()).isEqualTo(1L);
		assertThat(dto.getType()).isEqualTo(CompagnyType.FREELANCE);
		assertThat(dto.getContractStartAt()).isEqualTo(now);
		assertThat(dto.getContractEndAt()).isNull();
	}

	@Test
	void getCompagny_shouldThrowIfNotFound() {
		when(compagnyRepository.findById(2L)).thenReturn(Optional.empty());
		assertThatThrownBy(() -> compagnyService.getCompagny(2L)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void getAllCompagnies_shouldReturnList() {
		LocalDateTime now = LocalDateTime.now();
		Compagny c1 = Compagny.builder().id(1L).name("A").description("d").color("c").type(CompagnyType.PROSPECT)
				.contractStartAt(now).build();
		Compagny c2 = Compagny.builder().id(2L).name("B").description("d2").color("c2").type(CompagnyType.CDI)
				.contractStartAt(null).build();
		when(compagnyRepository.findAll()).thenReturn(List.of(c1, c2));

		List<CompagnyDto> list = compagnyService.getAllCompagnies();

		assertThat(list).hasSize(2);
		assertThat(list.get(0).getType()).isEqualTo(CompagnyType.PROSPECT);
		assertThat(list.get(1).getType()).isEqualTo(CompagnyType.CDI);
	}

	@Test
	void getAllActiveCompagnies_shouldReturnOnlyActive() {
		LocalDateTime now = LocalDateTime.now();
		Compagny active = Compagny.builder().id(1L).name("A").deletedAt(null).build();
		Compagny deleted = Compagny.builder().id(2L).name("B").deletedAt(now).build();
		when(compagnyRepository.findAllByDeletedAtIsNull()).thenReturn(List.of(active, deleted));
		when(compagnyRepository.findAllByDeletedAtIsNull()).thenReturn(List.of(active));

		List<CompagnyDto> list = compagnyService.getAllActiveCompagnies();

		assertThat(list).hasSize(1);
		assertThat(list.get(0).getId()).isEqualTo(1L);
	}

	@Test
	void toDto_shouldMapDeletedAt() {
		LocalDateTime now = LocalDateTime.now();
		Compagny compagny = Compagny.builder()
				.id(1L)
				.name("Test")
				.deletedAt(now)
				.build();

		CompagnyDto dto = compagnyService.toDto(compagny);

		assertThat(dto.getDeletedAt()).isEqualTo(now);
	}

	@Test
	void updateCompagny_shouldUpdateFields() {
		LocalDateTime now = LocalDateTime.now();
		Compagny compagny = Compagny.builder()
				.id(1L)
				.name("Old")
				.description("desc")
				.color("red")
				.type(CompagnyType.PROSPECT)
				.contractStartAt(now)
				.contractEndAt(null)
				.build();
		when(compagnyRepository.findById(1L)).thenReturn(Optional.of(compagny));
		when(compagnyRepository.save(any(Compagny.class))).thenReturn(compagny);

		UpdateCompagnyRequest req = UpdateCompagnyRequest.builder()
				.name("NewName")
				.type(CompagnyType.FREELANCE)
				.contractStartAt(now.plusDays(1))
				.contractEndAt(now.plusYears(1))
				.build();

		CompagnyDto dto = compagnyService.updateCompagny(1L, req);

		assertThat(dto.getName()).isEqualTo("NewName");
		assertThat(dto.getType()).isEqualTo(CompagnyType.FREELANCE);
		assertThat(dto.getContractStartAt()).isEqualTo(now.plusDays(1));
		assertThat(dto.getContractEndAt()).isEqualTo(now.plusYears(1));
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