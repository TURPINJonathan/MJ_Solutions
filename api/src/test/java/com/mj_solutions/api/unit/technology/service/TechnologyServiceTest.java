package com.mj_solutions.api.unit.technology.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.technology.dto.CreateTechnologyRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.dto.TechnologyImageDto;
import com.mj_solutions.api.technology.dto.TechnologyType;
import com.mj_solutions.api.technology.dto.UpdateTechnologyRequest;
import com.mj_solutions.api.technology.entity.Technology;
import com.mj_solutions.api.technology.entity.TechnologyImage;
import com.mj_solutions.api.technology.repository.TechnologyRepository;
import com.mj_solutions.api.technology.service.TechnologyService;

public class TechnologyServiceTest {
	@Mock
	private TechnologyRepository technologyRepository;
	@Mock
	private FileRepository fileRepository;
	@InjectMocks
	private TechnologyService technologyService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void createTechnology_shouldSaveAndReturnDto() {
		CreateTechnologyRequest req = CreateTechnologyRequest.builder()
				.name("Test Technology")
				.description("Test Description")
				.proficiency(54)
				.documentationUrl("http://example.com/docs")
				.color("#FFFFFF")
				.logo(null)
				.types(new TechnologyType[] { TechnologyType.BACKEND, TechnologyType.FRONTEND })
				.isFavorite(true)
				.build();

		Technology saved = Technology.builder()
				.id(1L)
				.name("Test Technology")
				.description("Test Description")
				.proficiency(54)
				.documentationUrl("http://example.com/docs")
				.color("#FFFFFF")
				.logo(null)
				.types(Arrays.asList(TechnologyType.BACKEND, TechnologyType.FRONTEND))
				.isFavorite(true)
				.build();

		when(technologyRepository.save(any(Technology.class))).thenReturn(saved);

		TechnologyDto dto = technologyService.createTechnology(req);

		assertThat(dto).isNotNull();
		assertThat(dto.getId()).isEqualTo(saved.getId());
		assertThat(dto.getName()).isEqualTo(saved.getName());
		assertThat(dto.getTypes()).containsExactlyInAnyOrderElementsOf(saved.getTypes());
	}

	@Test
	void createTechnology_withLogo_shouldSaveAndReturnDtoWithLogo() {
		File file = File.builder().id(10L).filename("logo.png").build();
		TechnologyImageDto logoDto = TechnologyImageDto.builder().fileId(10L).fileName("logo.png").build();

		CreateTechnologyRequest req = CreateTechnologyRequest.builder()
				.name("Tech")
				.logo(logoDto)
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.build();

		Technology techNoLogo = Technology.builder().id(1L).name("Tech").types(Arrays.asList(TechnologyType.BACKEND))
				.build();
		TechnologyImage logo = TechnologyImage.builder().id(2L).file(file).technology(techNoLogo).build();
		Technology techWithLogo = Technology.builder().id(1L).name("Tech").logo(logo)
				.types(Arrays.asList(TechnologyType.BACKEND)).build();

		when(technologyRepository.save(any(Technology.class))).thenReturn(techNoLogo, techWithLogo);
		when(fileRepository.findById(10L)).thenReturn(Optional.of(file));

		TechnologyDto dto = technologyService.createTechnology(req);

		assertThat(dto).isNotNull();
		assertThat(dto.getLogo()).isNotNull();
		assertThat(dto.getLogo().getFileId()).isEqualTo(10L);
	}

	@Test
	void updateTechnology_shouldUpdateAndReturnDto() {
		UpdateTechnologyRequest req = UpdateTechnologyRequest.builder()
				.name("Updated")
				.description("desc")
				.proficiency(80)
				.documentationUrl("url")
				.color("#000000")
				.types(new TechnologyType[] { TechnologyType.BACKEND })
				.isFavorite(false)
				.logo(null)
				.build();

		Technology existing = Technology.builder()
				.id(1L)
				.name("Old")
				.types(Arrays.asList(TechnologyType.FRONTEND))
				.build();

		Technology updated = Technology.builder()
				.id(1L)
				.name("Updated")
				.description("desc")
				.proficiency(80)
				.documentationUrl("url")
				.color("#000000")
				.types(Arrays.asList(TechnologyType.BACKEND))
				.isFavorite(false)
				.logo(null)
				.build();

		when(technologyRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(technologyRepository.save(any(Technology.class))).thenReturn(updated);

		TechnologyDto dto = technologyService.updateTechnology(1L, req);

		assertThat(dto).isNotNull();
		assertThat(dto.getName()).isEqualTo("Updated");
		assertThat(dto.getTypes()).containsExactly(TechnologyType.BACKEND);
	}

	@Test
	void getTechnologyById_shouldReturnDto() {
		Technology tech = Technology.builder().id(1L).name("Tech").types(Arrays.asList(TechnologyType.BACKEND)).build();
		when(technologyRepository.findById(1L)).thenReturn(Optional.of(tech));

		TechnologyDto dto = technologyService.getTechnologyById(1L);

		assertThat(dto).isNotNull();
		assertThat(dto.getId()).isEqualTo(1L);
	}

	@Test
	void getTechnologyById_shouldThrowIfNotFound() {
		when(technologyRepository.findById(1L)).thenReturn(Optional.empty());
		assertThatThrownBy(() -> technologyService.getTechnologyById(1L))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Technology not found");
	}

	@Test
	void getAllTechnologies_shouldReturnList() {
		Technology tech = Technology.builder().id(1L).name("Tech").types(Arrays.asList(TechnologyType.BACKEND)).build();
		when(technologyRepository.findAll()).thenReturn(Collections.singletonList(tech));

		List<TechnologyDto> list = technologyService.getAllTechnologies();

		assertThat(list).hasSize(1);
		assertThat(list.get(0).getId()).isEqualTo(1L);
	}

	@Test
	void getAllActiveTechnologies_shouldReturnList() {
		Technology tech = Technology.builder().id(1L).name("Tech").types(Arrays.asList(TechnologyType.BACKEND)).build();
		when(technologyRepository.findAllByDeletedAtIsNull()).thenReturn(Collections.singletonList(tech));

		List<TechnologyDto> list = technologyService.getAllActiveTechnologies();

		assertThat(list).hasSize(1);
		assertThat(list.get(0).getId()).isEqualTo(1L);
	}

	@Test
	void deleteTechnology_shouldSetDeletedAt() {
		Technology tech = Technology.builder().id(1L).name("Tech").build();
		when(technologyRepository.findById(1L)).thenReturn(Optional.of(tech));
		when(technologyRepository.save(any(Technology.class))).thenReturn(tech);

		technologyService.deleteTechnology(1L);

		assertThat(tech.getDeletedAt()).isNotNull();
	}

	@Test
	void deleteTechnology_shouldThrowIfNotFound() {
		when(technologyRepository.findById(1L)).thenReturn(Optional.empty());
		assertThatThrownBy(() -> technologyService.deleteTechnology(1L))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Technology not found");
	}
}