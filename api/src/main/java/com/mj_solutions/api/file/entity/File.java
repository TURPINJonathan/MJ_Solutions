package com.mj_solutions.api.file.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file", uniqueConstraints = @UniqueConstraint(columnNames = "filename"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class File {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private String filename;

	@Column(nullable = false)
	private String originalFilename;

	@Column(nullable = true)
	private String alt;

	@Column(nullable = false)
	private String contentType;

	@Column(nullable = false)
	private Long originalSize;

	@Lob
	@Column(nullable = false, columnDefinition = "LONGBLOB")
	private byte[] compressedData;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(nullable = true)
	private LocalDateTime updatedAt;

	@Column(nullable = true)
	private LocalDateTime deletedAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	public boolean isDeleted() {
		return deletedAt != null;
	}
}