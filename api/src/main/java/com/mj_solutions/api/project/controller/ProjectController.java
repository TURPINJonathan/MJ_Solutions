package com.mj_solutions.api.project.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mj_solutions.api.project.dto.CreateProjectRequest;
import com.mj_solutions.api.project.dto.ProjectDto;
import com.mj_solutions.api.project.dto.ProjectStatus;
import com.mj_solutions.api.project.dto.UpdateProjectRequest;
import com.mj_solutions.api.project.service.ProjectService;

@RestController
@RequestMapping("/project")
public class ProjectController {

	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@PostMapping("/create")
	public ResponseEntity<ProjectDto> createProject(@RequestBody CreateProjectRequest request) {
		ProjectDto project = projectService.createProject(request);

		if (project == null) {
			throw new IllegalArgumentException("Project creation failed");
		}

		return ResponseEntity.status(200).body(project);
	}

	@GetMapping("/all")
	public ResponseEntity<List<ProjectDto>> getAllProjects(
			@RequestParam(name = "includeDeleted", required = false, defaultValue = "false") boolean includeDeleted,
			@RequestParam(name = "includeArchived", required = false, defaultValue = "false") boolean includeArchived,
			@RequestParam(name = "includeDrafts", required = false, defaultValue = "false") boolean includeDrafts) {

		List<ProjectDto> allProjects = projectService.findAllProjects();

		// All active projects are filtered first
		List<ProjectDto> filtered = allProjects.stream()
				.filter(p -> p.getDeletedAt() == null && p.getArchivedAt() == null && p.getStatus() != ProjectStatus.DRAFT)
				.collect(Collectors.toList());

		// Add deleted projects if requested
		if (includeDeleted) {
			filtered.addAll(
					allProjects.stream()
							.filter(p -> p.getDeletedAt() != null)
							.collect(Collectors.toList()));
		}

		// Add archived projects if requested
		if (includeArchived) {
			filtered.addAll(
					allProjects.stream()
							.filter(p -> p.getArchivedAt() != null)
							.collect(Collectors.toList()));
		}

		// Add draft projects if requested
		if (includeDrafts) {
			filtered.addAll(
					allProjects.stream()
							.filter(p -> p.getStatus() == ProjectStatus.DRAFT)
							.collect(Collectors.toList()));
		}

		// Remove duplicates by ID
		filtered = filtered.stream()
				.collect(Collectors.toMap(ProjectDto::getId, p -> p, (a, b) -> a))
				.values()
				.stream()
				.collect(Collectors.toList());

		return ResponseEntity.ok(filtered);
	}

	@PatchMapping("/update/{id}")
	public ResponseEntity<ProjectDto> updateProject(
			@PathVariable Long id,
			@RequestBody UpdateProjectRequest request) {
		ProjectDto updated = projectService.updateProject(id, request);

		if (updated == null) {
			throw new IllegalArgumentException("Project update failed. Please check the request data or ID.");
		}

		return ResponseEntity.status(200).body(updated);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
		projectService.deleteProject(id);

		return ResponseEntity.status(204).build();
	}

}
