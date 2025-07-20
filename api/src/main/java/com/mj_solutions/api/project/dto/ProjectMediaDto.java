package com.mj_solutions.api.project.dto;

import java.util.List;

import com.mj_solutions.api.file.dto.FileDto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class ProjectMediaDto {
	private List<FileDto> picture;
	private List<FileDto> video;
}
