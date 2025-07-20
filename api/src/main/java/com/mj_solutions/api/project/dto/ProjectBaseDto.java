package com.mj_solutions.api.project.dto;

import java.util.List;

import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.technology.dto.TechnologyDto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class ProjectBaseDto {
	private String title;
	private String subtitle;
	private String description;
	private String slug;
	private String url;
	private String githubUrl;
	private List<ProjectDeveloperRole> developerRoles;
	private ProjectStatus status;
	private List<TechnologyDto> technologies;
	private List<CompagnyDto> companies;
	private Boolean isOnline;
	private ProjectMediaDto media;
}