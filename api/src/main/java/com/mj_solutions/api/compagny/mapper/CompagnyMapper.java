package com.mj_solutions.api.compagny.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.mj_solutions.api.compagny.dto.CompagnyContactDto;
import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.entity.CompagnyContact;
import com.mj_solutions.api.compagny.entity.CompagnyImage;

public class CompagnyMapper {
	public static CompagnyDto toDto(Compagny compagny) {
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
				.deletedAt(compagny.getDeletedAt())
				.pictures(toImageDtoList(compagny.getPictures()))
				.contacts(toContactDtoList(compagny.getContacts()))
				.build();
	}

	public static CompagnyDto.ImageDto toImageDto(CompagnyImage image) {
		return CompagnyDto.ImageDto.builder()
				.id(image.getId())
				.fileId(image.getFile().getId())
				.fileName(image.getFile().getName())
				.url("/files/" + image.getFile().getId() + "/raw")
				.isLogo(image.isLogo())
				.isMaster(image.isMaster())
				.build();
	}

	public static List<CompagnyDto.ImageDto> toImageDtoList(List<CompagnyImage> images) {
		if (images == null)
			return List.of();
		return images.stream()
				.map(CompagnyMapper::toImageDto)
				.collect(Collectors.toList());
	}

	public static List<CompagnyContactDto> toContactDtoList(List<CompagnyContact> contacts) {
		if (contacts == null)
			return List.of();
		return contacts.stream()
				.map(CompagnyMapper::toContactDto)
				.collect(Collectors.toList());
	}

	public static CompagnyContactDto toContactDto(CompagnyContact contact) {
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
