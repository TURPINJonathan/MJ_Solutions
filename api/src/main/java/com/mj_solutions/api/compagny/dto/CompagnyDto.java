package com.mj_solutions.api.compagny.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompagnyDto {
	private Long id;
	private String name;
	private String description;
	private String color;
	private String website;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<ImageDto> pictures;
	private List<CompagnyContactDto> contacts;

	@Data
	@Builder
	public static class ImageDto {
		private Long id; // id de CompagnyImage
		private Long fileId; // id du fichier
		private String fileName; // nom du fichier
		private String url; // URL d'accès à l'image (à générer côté service)
		private boolean isLogo;
		private boolean isMaster;
	}
}