package com.mj_solutions.api.technology.mapper;

import java.util.ArrayList;
import java.util.Arrays;

import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.technology.dto.CreateTechnologyRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.dto.TechnologyImageDto;
import com.mj_solutions.api.technology.dto.TechnologyType;
import com.mj_solutions.api.technology.entity.Technology;
import com.mj_solutions.api.technology.entity.TechnologyImage;

public class TechnologyMapper {

	public static Technology toEntity(CreateTechnologyRequest request) {
		return Technology.builder()
				.name(request.getName())
				.description(request.getDescription())
				.proficiency(request.getProficiency())
				.documentationUrl(request.getDocumentationUrl())
				.color(request.getColor())
				.types(request.getTypes() == null ? null : new ArrayList<>(Arrays.asList(request.getTypes())))
				.isFavorite(request.getIsFavorite())
				.build();
	}

	public static TechnologyDto toDto(Technology technology) {
		TechnologyImageDto logoDto = null;
		if (technology.getLogo() != null) {
			logoDto = toImageDto(technology.getLogo());
		}
		return TechnologyDto.builder()
				.id(technology.getId())
				.name(technology.getName())
				.description(technology.getDescription())
				.proficiency(technology.getProficiency())
				.documentationUrl(technology.getDocumentationUrl())
				.color(technology.getColor())
				.logo(logoDto)
				.types(technology.getTypes().toArray(new TechnologyType[0]))
				.isFavorite(technology.getIsFavorite())
				.createdAt(null == technology.getCreatedAt() ? null : technology.getCreatedAt())
				.updatedAt(null == technology.getUpdatedAt() ? null : technology.getUpdatedAt())
				.deletedAt(null == technology.getDeletedAt() ? null : technology.getDeletedAt())
				.build();
	}

	public static TechnologyImage toImageEntity(TechnologyImageDto dto, Technology technology, File file) {
		if (dto == null || file == null)
			return null;
		return TechnologyImage.builder()
				.technology(technology)
				.file(file)
				.build();
	}

	public static TechnologyImageDto toImageDto(TechnologyImage image) {
		if (image == null || image.getFile() == null)
			return null;
		return TechnologyImageDto.builder()
				.id(image.getId())
				.fileId(image.getFile().getId())
				.fileName(image.getFile().getFilename())
				.url("/files/" + image.getFile().getId() + "/raw")
				.build();
	}
}