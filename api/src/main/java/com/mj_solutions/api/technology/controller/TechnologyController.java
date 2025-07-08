package com.mj_solutions.api.technology.controller;

import java.util.List;

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

import com.mj_solutions.api.technology.dto.CreateTechnologyRequest;
import com.mj_solutions.api.technology.dto.TechnologyDto;
import com.mj_solutions.api.technology.dto.UpdateTechnologyRequest;
import com.mj_solutions.api.technology.service.TechnologyService;

@RestController
@RequestMapping("/technology")
public class TechnologyController {

	private final TechnologyService TechnologyService;

	public TechnologyController(TechnologyService TechnologyService) {
		this.TechnologyService = TechnologyService;
	}

	@PostMapping("/create")
	public ResponseEntity<TechnologyDto> createTechnology(@RequestBody CreateTechnologyRequest request) {
		TechnologyDto created = TechnologyService.createTechnology(request);

		if (created == null) {
			throw new IllegalArgumentException("Technology creation failed. Please check the request data.");
		}

		return ResponseEntity.status(201).body(created);
	}

	@PatchMapping("/update/{id}")
	public ResponseEntity<TechnologyDto> updateTechnology(@PathVariable Long id,
			@RequestBody UpdateTechnologyRequest request) {
		TechnologyDto updated = TechnologyService.updateTechnology(id, request);

		if (updated == null) {
			throw new IllegalArgumentException("Technology update failed. Please check the request data or ID.");
		}

		return ResponseEntity.status(200).body(updated);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TechnologyDto> getTechnologyById(@PathVariable Long id) {
		TechnologyDto technology = TechnologyService.getTechnologyById(id);

		if (technology == null) {
			throw new IllegalArgumentException("Technology not found with ID: " + id);
		}

		return ResponseEntity.status(200).body(technology);
	}

	@GetMapping("/all")
	public ResponseEntity<Iterable<TechnologyDto>> getAllTechnologies(
			@RequestParam(name = "includeDeleted", required = false, defaultValue = "false") boolean includeDeleted) {
		List<TechnologyDto> technologies = includeDeleted
				? TechnologyService.getAllTechnologies()
				: TechnologyService.getAllActiveTechnologies();

		if (technologies == null) {
			throw new IllegalArgumentException("No technologies found.");
		}

		return ResponseEntity.status(200).body(technologies);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteTechnology(@PathVariable Long id) {
		TechnologyService.deleteTechnology(id);
		return ResponseEntity.status(204).build();
	}

}
