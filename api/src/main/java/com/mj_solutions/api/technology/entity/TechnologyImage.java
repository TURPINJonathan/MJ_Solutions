package com.mj_solutions.api.technology.entity;

import com.mj_solutions.api.file.entity.File;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "technology_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnologyImage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "technology_id", nullable = false)
	private Technology technology;

	@OneToOne
	@JoinColumn(name = "file_id", nullable = false)
	private File file;
}
