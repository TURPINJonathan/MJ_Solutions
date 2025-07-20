package com.mj_solutions.api.file.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileDto {
	private Long id;
	private String name;
	private String filename;
	private String originalFilename;
	private String alt;
	private String contentType;
	private Long originalSize;
	private String url;
	private LocalDateTime createdAt;
}