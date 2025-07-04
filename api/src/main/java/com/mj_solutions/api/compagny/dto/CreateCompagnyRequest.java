package com.mj_solutions.api.compagny.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateCompagnyRequest {
	private String name;
	private String description;
	private String color;
	private String website;
	private CompagnyType type;
	private LocalDateTime contractStartAt;
	private LocalDateTime contractEndAt;
	private List<ImageRequest> pictures;
	private List<ContactRequest> contacts;

	@Data
	@Builder
	public static class ContactRequest {
		private String lastname;
		private String firstname;
		private String position;
		private String email;
		private String phone;
		private Long pictureId;
	}

	@Data
	@Builder
	public static class ImageRequest {
		private Long fileId;
		private boolean isLogo;
		private boolean isMaster;
	}
}