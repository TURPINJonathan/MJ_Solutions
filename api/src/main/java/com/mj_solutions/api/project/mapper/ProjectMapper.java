package com.mj_solutions.api.project.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.mapper.CompagnyMapper;
import com.mj_solutions.api.file.dto.FileDto;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.project.dto.CreateProjectRequest;
import com.mj_solutions.api.project.dto.ProjectDto;
import com.mj_solutions.api.project.dto.ProjectMediaDto;
import com.mj_solutions.api.project.entity.Project;
import com.mj_solutions.api.project.entity.ProjectMedia;
import com.mj_solutions.api.technology.entity.Technology;
import com.mj_solutions.api.technology.mapper.TechnologyMapper;
import com.mj_solutions.api.utils.StringUtils;

public class ProjectMapper {

	public static Project toEntity(CreateProjectRequest request) {
		String slug = request.getSlug();
		if (slug == null || slug.isBlank()) {
			slug = StringUtils.generateSlug(request.getTitle());
		}

		return Project.builder()
				.title(request.getTitle())
				.subtitle(request.getSubtitle())
				.description(request.getDescription())
				.slug(request.getSlug())
				.url(slug)
				.githubUrl(request.getGithubUrl())
				.developerRoles(request.getDeveloperRoles())
				.status(request.getStatus())
				.isOnline(request.getIsOnline())
				.build();
	}

	public static ProjectDto toDto(Project project) {
		return ProjectDto.builder()
				.id(project.getId())
				.title(project.getTitle())
				.subtitle(project.getSubtitle())
				.description(project.getDescription())
				.slug(project.getSlug())
				.url(project.getUrl())
				.githubUrl(project.getGithubUrl())
				.developerRoles(project.getDeveloperRoles())
				.status(project.getStatus())
				.isOnline(project.getIsOnline())
				.createdAt(project.getCreatedAt())
				.updatedAt(project.getUpdatedAt())
				.publishedAt(project.getPublishedAt())
				.archivedAt(project.getArchivedAt())
				.deletedAt(project.getDeletedAt())
				.technologies(project.getTechnologies() != null
						? project.getTechnologies().stream().map(TechnologyMapper::toDto).collect(Collectors.toList())
						: List.of())
				.companies(project.getCompanies() != null
						? project.getCompanies().stream().map(CompagnyMapper::toDto).collect(Collectors.toList())
						: List.of())
				.media(mapMediaToDto(project.getMedia()))
				.build();
	}

	public static List<Long> mapTechnologiesToIds(List<Technology> technologies) {
		if (technologies == null)
			return List.of();
		return technologies.stream().map(Technology::getId).collect(Collectors.toList());
	}

	public static List<Long> mapCompaniesToIds(List<Compagny> companies) {
		if (companies == null)
			return List.of();
		return companies.stream().map(Compagny::getId).collect(Collectors.toList());
	}

	public static ProjectMediaDto mapMediaToDto(ProjectMedia media) {
		if (media == null)
			return null;
		return ProjectMediaDto.builder()
				.picture(media.getPicture() != null
						? media.getPicture().stream().map(ProjectMapper::toSimpleFileDto).collect(Collectors.toList())
						: List.of())
				.video(media.getVideo() != null
						? media.getVideo().stream().map(ProjectMapper::toSimpleFileDto).collect(Collectors.toList())
						: List.of())
				.build();
	}

	private static FileDto toSimpleFileDto(File file) {
		return FileDto.builder()
				.id(file.getId())
				.name(file.getName())
				.filename(file.getFilename())
				.originalFilename(file.getOriginalFilename())
				.alt(file.getAlt())
				.contentType(file.getContentType())
				.originalSize(file.getOriginalSize())
				.url("/files/" + file.getId() + "/raw")
				.createdAt(file.getCreatedAt())
				.build();
	}
}