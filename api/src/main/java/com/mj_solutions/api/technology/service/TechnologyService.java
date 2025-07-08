package com.mj_solutions.api.technology.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.technology.dto.CreateTechnologyRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.dto.TechnologyImageDto;
import com.mj_solutions.api.technology.dto.UpdateTechnologyRequest;
import com.mj_solutions.api.technology.entity.Technology;
import com.mj_solutions.api.technology.entity.TechnologyImage;
import com.mj_solutions.api.technology.mapper.TechnologyMapper;
import com.mj_solutions.api.technology.repository.TechnologyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TechnologyService {

	private final TechnologyRepository technologyRepository;
	private final FileRepository fileRepository;

	@Transactional
	public TechnologyDto createTechnology(CreateTechnologyRequest request) {
		Technology technology = TechnologyMapper.toEntity(request);

		Technology saved = technologyRepository.save(technology);

		if (request.getLogo() != null) {
			File file = fileRepository.findById(request.getLogo().getFileId())
					.orElseThrow(() -> new IllegalArgumentException("File not found: " + request.getLogo().getFileId()));
			TechnologyImage logo = TechnologyMapper.toImageEntity(request.getLogo(), saved, file);
			saved.setLogo(logo);
			saved = technologyRepository.save(saved);
		}

		return TechnologyMapper.toDto(saved);
	}

	@Transactional
	public TechnologyDto updateTechnology(Long id, UpdateTechnologyRequest request) {
		Technology technology = technologyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Technology not found: " + id));

		technology.setName(request.getName());
		technology.setDescription(request.getDescription());
		technology.setProficiency(request.getProficiency());
		technology.setDocumentationUrl(request.getDocumentationUrl());
		technology.setColor(request.getColor());
		technology.setTypes(request.getTypes() == null ? null : new ArrayList<>(Arrays.asList(request.getTypes())));
		technology.setIsFavorite(request.getIsFavorite());

		setLogo(technology, request.getLogo());

		Technology saved = technologyRepository.save(technology);

		return TechnologyMapper.toDto(saved);
	}

	@Transactional(readOnly = true)
	public TechnologyDto getTechnologyById(Long id) {
		Technology technology = technologyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Technology not found: " + id));
		return TechnologyMapper.toDto(technology);
	}

	@Transactional(readOnly = true)
	public List<TechnologyDto> getAllTechnologies() {
		return technologyRepository.findAll().stream()
				.map(TechnologyMapper::toDto)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<TechnologyDto> getAllActiveTechnologies() {
		return technologyRepository.findAllByDeletedAtIsNull().stream()
				.map(TechnologyMapper::toDto)
				.collect(Collectors.toList());
	}

	@Transactional
	public void deleteTechnology(Long id) {
		Technology technology = technologyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Technology not found: " + id));

		if (technology.getDeletedAt() == null) {
			technology.setDeletedAt(LocalDateTime.now());
			technologyRepository.save(technology);
		}
	}

	private void setLogo(Technology technology, TechnologyImageDto logoDto) {
		if (logoDto != null) {
			File file = fileRepository.findById(logoDto.getFileId())
					.orElseThrow(() -> new IllegalArgumentException("File not found: " + logoDto.getFileId()));
			TechnologyImage logo = TechnologyMapper.toImageEntity(logoDto, technology, file);
			technology.setLogo(logo);
		} else {
			technology.setLogo(null);
		}
	}
}