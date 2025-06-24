package com.mj_solutions.api.compagny.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CreateCompagnyRequest;
import com.mj_solutions.api.compagny.dto.UpdateCompagnyRequest;
import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.entity.CompagnyImage;
import com.mj_solutions.api.compagny.repository.CompagnyImageRepository;
import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompagnyService {

	private final CompagnyRepository compagnyRepository;
	private final CompagnyImageRepository compagnyImageRepository;
	private final FileRepository fileRepository;

	// CREATE
	@Transactional
	public CompagnyDto createCompagny(CreateCompagnyRequest request) {
		Compagny compagny = Compagny.builder()
				.name(request.getName())
				.description(request.getDescription())
				.color(request.getColor())
				.website(request.getWebsite())
				.build();

		List<CompagnyImage> images = request.getPictures() != null
				? request.getPictures().stream()
						.map(imgReq -> {
							File file = fileRepository.findById(imgReq.getFileId())
									.orElseThrow(() -> new IllegalArgumentException("File not found: " + imgReq.getFileId()));
							return CompagnyImage.builder()
									.compagny(compagny)
									.file(file)
									.isLogo(imgReq.isLogo())
									.isMaster(imgReq.isMaster())
									.build();
						})
						.collect(Collectors.toList())
				: List.of();

		compagny.setPictures(images);
		Compagny saved = compagnyRepository.save(compagny);
		return toDto(saved);
	}

	// READ
	@Transactional(readOnly = true)
	public CompagnyDto getCompagny(Long id) {
		Compagny compagny = compagnyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Compagny not found: " + id));
		return toDto(compagny);
	}

	@Transactional(readOnly = true)
	public List<CompagnyDto> getAllCompagnies() {
		return compagnyRepository.findAll().stream()
				.map(this::toDto)
				.collect(Collectors.toList());
	}

	// UPDATE
	@Transactional
	public CompagnyDto updateCompagny(Long id, UpdateCompagnyRequest request) {
		Compagny compagny = compagnyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Compagny not found: " + id));

		// Mise à jour partielle des champs (seulement si non null)
		if (request.getName() != null) {
			compagny.setName(request.getName());
		}
		if (request.getDescription() != null) {
			compagny.setDescription(request.getDescription());
		}
		if (request.getColor() != null) {
			compagny.setColor(request.getColor());
		}
		if (request.getWebsite() != null) {
			compagny.setWebsite(request.getWebsite());
		}

		// Gestion des images : si le champ pictures est présent, on remplace tout
		if (request.getPictures() != null) {
			// Supprime les anciennes images
			compagnyImageRepository.deleteAll(compagny.getPictures());

			List<CompagnyImage> images = request.getPictures().stream()
					.map(imgReq -> {
						File file = fileRepository.findById(imgReq.getFileId())
								.orElseThrow(() -> new IllegalArgumentException("File not found: " + imgReq.getFileId()));
						return CompagnyImage.builder()
								.compagny(compagny)
								.file(file)
								.isLogo(imgReq.isLogo())
								.isMaster(imgReq.isMaster())
								.build();
					})
					.collect(Collectors.toList());
			compagny.setPictures(images);
		}

		Compagny saved = compagnyRepository.save(compagny);
		return toDto(saved);
	}

	// DELETE
	@Transactional
	public void deleteCompagny(Long id) {
		Compagny compagny = compagnyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Compagny not found: " + id));
		if (compagny.getDeletedAt() == null) {
			compagny.setDeletedAt(java.time.LocalDateTime.now());
			compagnyRepository.save(compagny);
		}
	}

	// MAPPING
	public CompagnyDto toDto(Compagny compagny) {
		return CompagnyDto.builder()
				.id(compagny.getId())
				.name(compagny.getName())
				.description(compagny.getDescription())
				.color(compagny.getColor())
				.website(compagny.getWebsite())
				.createdAt(compagny.getCreatedAt())
				.updatedAt(compagny.getUpdatedAt())
				.pictures(toImageDtoList(compagny.getPictures()))
				.build();
	}

	private List<CompagnyDto.ImageDto> toImageDtoList(List<CompagnyImage> images) {
		if (images == null)
			return List.of();
		return images.stream()
				.map(this::toImageDto)
				.collect(Collectors.toList());
	}

	private CompagnyDto.ImageDto toImageDto(CompagnyImage image) {
		return CompagnyDto.ImageDto.builder()
				.id(image.getId())
				.fileId(image.getFile().getId())
				.fileName(image.getFile().getName())
				.url("/files/" + image.getFile().getId())
				.isLogo(image.isLogo())
				.isMaster(image.isMaster())
				.build();
	}
}