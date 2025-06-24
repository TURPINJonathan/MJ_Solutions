package com.mj_solutions.api.file.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mj_solutions.api.file.entity.File;
import com.mj_solutions.api.file.repository.FileRepository;
import com.mj_solutions.api.file.utils.CompressFileUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

	private final FileRepository fileRepository;

	@PostMapping("/upload")
	public ResponseEntity<?> uploadFile(
			@RequestParam("file") MultipartFile file,
			@RequestParam("name") String name,
			@RequestParam(value = "alt", required = false) String alt) throws IOException {

		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || originalFilename.isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of(
							"success", false,
							"message", "File name missing."));
		}

		String extension = "";
		int i = originalFilename.lastIndexOf('.');
		if (i > 0) {
			extension = originalFilename.substring(i);
		}
		String uniqueFilename = UUID.randomUUID() + extension;

		byte[] compressed = CompressFileUtils.compress(file.getBytes());

		File doc = File.builder()
				.name(name)
				.filename(uniqueFilename)
				.alt(alt)
				.contentType(file.getContentType())
				.originalSize(file.getSize())
				.compressedData(compressed)
				.originalFilename(originalFilename)
				.build();

		try {
			File saved = fileRepository.save(doc);
			Map<String, Object> data = new HashMap<>();
			data.put("id", saved.getId());
			data.put("filename", saved.getFilename());
			data.put("originalFilename", saved.getOriginalFilename());
			data.put("name", saved.getName());
			data.put("alt", saved.getAlt());
			data.put("contentType", saved.getContentType());
			data.put("originalSize", saved.getOriginalSize());
			data.put("createdAt", saved.getCreatedAt());

			return ResponseEntity.ok(Map.of(
					"success", true,
					"data", data));
		} catch (DataIntegrityViolationException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of(
							"success", false,
							"message", "A file with this name already exists."));
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> downloadFile(@PathVariable Long id) {
		return fileRepository.findById(id)
				.filter(f -> f.getDeletedAt() == null)
				.map(doc -> {
					try {
						byte[] data = CompressFileUtils.decompress(doc.getCompressedData());
						String base64 = Base64.getEncoder().encodeToString(data);

						Map<String, Object> fileData = new HashMap<>();
						fileData.put("id", doc.getId());
						fileData.put("filename", doc.getFilename());
						fileData.put("originalFilename", doc.getOriginalFilename());
						fileData.put("name", doc.getName());
						fileData.put("alt", doc.getAlt());
						fileData.put("contentType", doc.getContentType());
						fileData.put("originalSize", doc.getOriginalSize());
						fileData.put("createdAt", doc.getCreatedAt());
						fileData.put("data", base64);

						return ResponseEntity.ok(Map.of(
								"success", true,
								"data", fileData));
					} catch (IOException e) {
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body(Map.of(
										"success", false,
										"message", "Error decompressing file."));
					}
				})
				.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of(
								"success", false,
								"message", "File not found or deleted.")));
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> softDeleteFile(@PathVariable Long id) {
		return fileRepository.findById(id)
				.map(file -> {
					file.setDeletedAt(LocalDateTime.now());
					fileRepository.save(file);
					return ResponseEntity.ok(Map.of(
							"success", true,
							"message", "File deleted."));
				})
				.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of(
								"success", false,
								"message", "File not found.")));
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateFile(
			@PathVariable Long id,
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "alt", required = false) String alt) throws IOException {

		return fileRepository.findById(id)
				.filter(f -> f.getDeletedAt() == null)
				.map(existingFile -> {
					if (name != null)
						existingFile.setName(name);
					if (alt != null)
						existingFile.setAlt(alt);

					if (file != null && !file.isEmpty()) {
						String originalFilename = file.getOriginalFilename();
						if (originalFilename == null || originalFilename.isBlank()) {
							return ResponseEntity.status(HttpStatus.BAD_REQUEST)
									.body(Map.of(
											"success", false,
											"message", "File name is missing."));
						}
						String extension = "";
						int i = originalFilename.lastIndexOf('.');
						if (i > 0) {
							extension = originalFilename.substring(i);
						}
						String uniqueFilename = UUID.randomUUID() + extension;

						byte[] compressed;
						try {
							compressed = CompressFileUtils.compress(file.getBytes());
						} catch (IOException e) {
							return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
									.body(Map.of(
											"success", false,
											"message", "Error compressing file."));
						}

						existingFile.setFilename(uniqueFilename);
						existingFile.setOriginalFilename(originalFilename);
						existingFile.setContentType(file.getContentType());
						existingFile.setOriginalSize(file.getSize());
						existingFile.setCompressedData(compressed);
					}

					existingFile.setUpdatedAt(LocalDateTime.now());
					File saved = fileRepository.save(existingFile);

					Map<String, Object> data = new HashMap<>();
					data.put("id", saved.getId());
					data.put("filename", saved.getFilename());
					data.put("originalFilename", saved.getOriginalFilename());
					data.put("name", saved.getName());
					data.put("alt", saved.getAlt());
					data.put("contentType", saved.getContentType());
					data.put("originalSize", saved.getOriginalSize());
					data.put("createdAt", saved.getCreatedAt());
					data.put("updatedAt", saved.getUpdatedAt());

					return ResponseEntity.ok(Map.of(
							"success", true,
							"data", data));
				})
				.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of(
								"success", false,
								"message", "File not found or deleted.")));
	}
}