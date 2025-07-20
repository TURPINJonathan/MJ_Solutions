package com.mj_solutions.api.project.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
public class UpdateProjectRequest {
	private String title;
	private String subtitle;
	private String description;
	private String slug;
	private String url;
	private String githubUrl;
	private List<ProjectDeveloperRole> developerRoles;
	private ProjectStatus status;
	private Boolean isOnline;
	private List<Long> technologyIds;
	private List<Long> compagnyIds;
	private UpdateMediaDto updateMedia;

	@Data
	@NoArgsConstructor
	@SuperBuilder
	public static class UpdateMediaDto {
		private List<Long> pictureIds;
		private List<Long> videoIds;
	}
}
