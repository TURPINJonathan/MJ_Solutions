package com.mj_solutions.api.project.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.file.dto.FileDto;
import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.project.dto.CreateProjectRequest;
import com.mj_solutions.api.project.dto.ProjectDto;
import com.mj_solutions.api.project.dto.UpdateProjectRequest;
import com.mj_solutions.api.project.entity.Project;
import com.mj_solutions.api.project.entity.ProjectMedia;
import com.mj_solutions.api.project.mapper.ProjectMapper;
import com.mj_solutions.api.project.repository.ProjectRepository;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.entity.Technology;
import com.mj_solutions.api.technology.repository.TechnologyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {
	private final ProjectRepository projectRepository;
	private final FileRepository fileRepository;
	private final TechnologyRepository technologyRepository;
	private final CompagnyRepository compagnyRepository;

	@Transactional
	public ProjectDto createProject(CreateProjectRequest request) {
		Project project = ProjectMapper.toEntity(request);

		List<Long> technologyIds = request.getTechnologies().stream()
				.map(TechnologyDto::getId)
				.collect(Collectors.toList());

		List<Technology> technologies = technologyRepository.findAllById(technologyIds);
		project.setTechnologies(technologies);

		List<Long> companyIds = request.getCompanies().stream()
				.map(CompagnyDto::getId)
				.collect(Collectors.toList());
		List<Compagny> companies = compagnyRepository.findAllById(companyIds);
		project.setCompanies(companies);

		List<Long> pictureIds = request.getMedia() != null && request.getMedia().getPicture() != null
				? request.getMedia().getPicture().stream().map(FileDto::getId).collect(Collectors.toList())
				: List.of();
		List<File> pictures = pictureIds.isEmpty() ? List.of() : fileRepository.findAllById(pictureIds);

		List<Long> videoIds = request.getMedia() != null && request.getMedia().getVideo() != null
				? request.getMedia().getVideo().stream().map(FileDto::getId).collect(Collectors.toList())
				: List.of();
		List<File> videos = videoIds.isEmpty() ? List.of() : fileRepository.findAllById(videoIds);

		ProjectMedia media = ProjectMedia.builder()
				.picture(pictures)
				.video(videos)
				.build();
		project.setMedia(media);

		Project saved = projectRepository.save(project);

		return ProjectMapper.toDto(saved);
	}

	@Transactional(readOnly = true)
	public List<ProjectDto> findAllProjects() {
		List<Project> projects = projectRepository.findAll();

		return projects.stream().map(ProjectMapper::toDto).toList();
	}

	@Transactional
	public ProjectDto updateProject(Long id, UpdateProjectRequest request) {
		Project project = projectRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));

		if (request.getTitle() != null)
			project.setTitle(request.getTitle());
		if (request.getSubtitle() != null)
			project.setSubtitle(request.getSubtitle());
		if (request.getDescription() != null)
			project.setDescription(request.getDescription());
		if (request.getSlug() != null)
			project.setSlug(request.getSlug());
		if (request.getUrl() != null)
			project.setUrl(request.getUrl());
		if (request.getGithubUrl() != null)
			project.setGithubUrl(request.getGithubUrl());
		if (request.getDeveloperRoles() != null)
			project.setDeveloperRoles(request.getDeveloperRoles());
		if (request.getStatus() != null)
			project.setStatus(request.getStatus());
		if (request.getIsOnline() != null)
			project.setIsOnline(request.getIsOnline());

		if (request.getTechnologyIds() != null) {
			List<Technology> technologies = technologyRepository.findAllById(request.getTechnologyIds());
			project.setTechnologies(technologies);
		}

		if (request.getCompagnyIds() != null) {
			List<Compagny> companies = compagnyRepository.findAllById(request.getCompagnyIds());
			project.setCompanies(companies);
		}

		if (request.getUpdateMedia() != null) {
			List<Long> pictureIds = request.getUpdateMedia().getPictureIds() != null
					? request.getUpdateMedia().getPictureIds()
					: List.of();
			List<File> pictures = pictureIds.isEmpty() ? List.of() : fileRepository.findAllById(pictureIds);

			List<Long> videoIds = request.getUpdateMedia().getVideoIds() != null
					? request.getUpdateMedia().getVideoIds()
					: List.of();
			List<File> videos = videoIds.isEmpty() ? List.of() : fileRepository.findAllById(videoIds);

			ProjectMedia media = ProjectMedia.builder()
					.picture(pictures)
					.video(videos)
					.build();
			project.setMedia(media);
		}

		Project saved = projectRepository.save(project);
		return ProjectMapper.toDto(saved);
	}

	@Transactional
	public void deleteProject(Long id) {
		Project project = projectRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));

		if (project.getDeletedAt() == null) {
			project.setDeletedAt(LocalDateTime.now());
			projectRepository.save(project);
		}
	}

}