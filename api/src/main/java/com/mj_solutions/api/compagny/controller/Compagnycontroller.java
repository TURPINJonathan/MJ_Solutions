package com.mj_solutions.api.compagny.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mj_solutions.api.compagny.dto.CompagnyDto;
import com.mj_solutions.api.compagny.dto.CreateCompagnyRequest;
import com.mj_solutions.api.compagny.dto.UpdateCompagnyRequest;
import com.mj_solutions.api.compagny.repository.CompagnyImageRepository;
import com.mj_solutions.api.compagny.repository.CompagnyRepository;
import com.mj_solutions.api.compagny.service.CompagnyService;

@RestController
@RequestMapping("/compagny")
public class Compagnycontroller {

	private final CompagnyService compagnyService;

	public Compagnycontroller(CompagnyService compagnyService, CompagnyRepository compagnyRepository,
			CompagnyImageRepository compagnyImageRepository) {
		this.compagnyService = compagnyService;
	}

	@PostMapping("/create")
	public ResponseEntity<CompagnyDto> createCompagny(@RequestBody CreateCompagnyRequest request) {
		CompagnyDto created = compagnyService.createCompagny(request);

		if (created == null) {
			throw new IllegalArgumentException("Compagny creation failed. Please check the request data.");
		}

		return ResponseEntity.status(201).body(created);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CompagnyDto> getCompagny(@PathVariable Long id) {
		CompagnyDto compagny = compagnyService.getCompagny(id);
		if (compagny == null) {
			throw new IllegalArgumentException("Compagny not found with ID: " + id);
		}
		return ResponseEntity.status(200).body(compagny);
	}

	@GetMapping("/all")
	public ResponseEntity<List<CompagnyDto>> getAllCompagnies() {
		List<CompagnyDto> compagnies = compagnyService.getAllCompagnies();
		if (compagnies == null || compagnies.isEmpty()) {
			throw new IllegalArgumentException("No compagnies found.");
		}

		return ResponseEntity.status(200).body(compagnies);
	}

	@PatchMapping("/update/{id}")
	public ResponseEntity<CompagnyDto> updateCompagny(@PathVariable Long id,
			@RequestBody UpdateCompagnyRequest request) {
		CompagnyDto updated = compagnyService.updateCompagny(id, request);
		if (updated == null) {
			throw new IllegalArgumentException("Compagny update failed. Please check the request data.");
		}

		return ResponseEntity.status(200).body(updated);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteCompagny(@PathVariable Long id) {
		compagnyService.deleteCompagny(id);
		return ResponseEntity.status(204).build();
	}

}
