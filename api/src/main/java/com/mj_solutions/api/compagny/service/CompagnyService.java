package com.mj_solutions.api.compagny.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mj_solutions.api.compagny.dto.CompagnyContactDto;
import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CreateCompagnyRequest;
import com.mj_solutions.api.compagny.dto.UpdateCompagnyRequest;
import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.entity.CompagnyContact;
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
				.type(request.getType())
				.contractStartAt(request.getContractStartAt())
				.contractEndAt(request.getContractEndAt())
				.build();

		// Images
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

		// Contacts
		List<CompagnyContact> contacts = request.getContacts() != null
				? request.getContacts().stream()
						.map(contactReq -> {
							File picture = null;
							if (contactReq.getPictureId() != null) {
								picture = fileRepository.findById(contactReq.getPictureId()).orElse(null);
							}
							return CompagnyContact.builder()
									.compagny(compagny)
									.lastname(contactReq.getLastname())
									.firstname(contactReq.getFirstname())
									.position(contactReq.getPosition())
									.email(contactReq.getEmail())
									.phone(contactReq.getPhone())
									.picture(picture)
									.build();
						})
						.collect(Collectors.toList())
				: List.of();
		compagny.setContacts(contacts);

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

		// Mise à jour des champs simples
		if (request.getName() != null)
			compagny.setName(request.getName());
		if (request.getDescription() != null)
			compagny.setDescription(request.getDescription());
		if (request.getColor() != null)
			compagny.setColor(request.getColor());
		if (request.getWebsite() != null)
			compagny.setWebsite(request.getWebsite());
		if (request.getType() != null)
			compagny.setType(request.getType());
		if (request.getContractStartAt() != null)
			compagny.setContractStartAt(request.getContractStartAt());
		if (request.getContractEndAt() != null)
			compagny.setContractEndAt(request.getContractEndAt());

		if (request.getPictures() != null && !request.getPictures().isEmpty()) {
			compagny.getPictures().clear();
			for (var imgReq : request.getPictures()) {
				File file = fileRepository.findById(imgReq.getFileId())
						.orElseThrow(() -> new IllegalArgumentException("File not found: " + imgReq.getFileId()));
				CompagnyImage newImg = CompagnyImage.builder()
						.compagny(compagny)
						.file(file)
						.isLogo(imgReq.isLogo())
						.isMaster(imgReq.isMaster())
						.build();
				compagny.getPictures().add(newImg);
			}
		}

		if (request.getContacts() != null) {
			compagny.getContacts()
					.removeIf(contact -> request.getContacts().stream().noneMatch(c -> c.getEmail().equals(contact.getEmail())
							&& c.getFirstname().equals(contact.getFirstname())
							&& c.getLastname().equals(contact.getLastname())));

			for (var contactReq : request.getContacts()) {
				CompagnyContact existing = compagny.getContacts().stream()
						.filter(c -> c.getEmail().equals(contactReq.getEmail())
								&& c.getFirstname().equals(contactReq.getFirstname())
								&& c.getLastname().equals(contactReq.getLastname()))
						.findFirst()
						.orElse(null);

				File picture = null;
				if (contactReq.getPictureId() != null) {
					picture = fileRepository.findById(contactReq.getPictureId()).orElse(null);
				}

				if (existing != null) {
					existing.setPosition(contactReq.getPosition());
					existing.setPhone(contactReq.getPhone());
					existing.setPicture(picture);
				} else {
					CompagnyContact newContact = CompagnyContact.builder()
							.compagny(compagny)
							.lastname(contactReq.getLastname())
							.firstname(contactReq.getFirstname())
							.position(contactReq.getPosition())
							.email(contactReq.getEmail())
							.phone(contactReq.getPhone())
							.picture(picture)
							.build();
					compagny.getContacts().add(newContact);
				}
			}
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
				.type(compagny.getType())
				.contractStartAt(compagny.getContractStartAt())
				.contractEndAt(compagny.getContractEndAt())
				.createdAt(compagny.getCreatedAt())
				.updatedAt(compagny.getUpdatedAt())
				.pictures(toImageDtoList(compagny.getPictures()))
				.contacts(toContactDtoList(compagny.getContacts()))
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
				.url("/files/" + image.getFile().getId() + "/raw")
				.isLogo(image.isLogo())
				.isMaster(image.isMaster())
				.build();
	}

	private List<CompagnyContactDto> toContactDtoList(List<CompagnyContact> contacts) {
		if (contacts == null)
			return List.of();
		return contacts.stream()
				.map(this::toContactDto)
				.collect(Collectors.toList());
	}

	private CompagnyContactDto toContactDto(CompagnyContact contact) {
		return CompagnyContactDto.builder()
				.id(contact.getId())
				.lastname(contact.getLastname())
				.firstname(contact.getFirstname())
				.position(contact.getPosition())
				.email(contact.getEmail())
				.phone(contact.getPhone())
				.picture(contact.getPicture() != null
						? CompagnyDto.ImageDto.builder()
								.id(contact.getPicture().getId())
								.fileId(contact.getPicture().getId())
								.fileName(contact.getPicture().getName())
								.url("/files/" + contact.getPicture().getId() + "/raw")
								.isLogo(false)
								.isMaster(false)
								.build()
						: null)
				.build();
	}
}