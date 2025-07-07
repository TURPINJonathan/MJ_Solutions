package com.mj_solutions.api.compagny.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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
	private CompagnyType type;
	private LocalDateTime contractStartAt;
	private LocalDateTime contractEndAt;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private LocalDateTime deletedAt;
	private List<ImageDto> pictures;
	private List<CompagnyContactDto> contacts;

	@Data
	@Builder
	public static class ImageDto {
		private Long id; // id de CompagnyImage
		private Long fileId; // id du fichier
		private String fileName; // nom du fichier
		private String url; // URL d'accès à l'image (à générer côté service)
		@JsonProperty("isLogo")
		private boolean isLogo;
		@JsonProperty("isMaster")
		private boolean isMaster;
	}
}