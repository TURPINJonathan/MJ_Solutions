package com.mj_solutions.api.technology.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.mj_solutions.api.technology.dto.TechnologyType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "technology")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Technology {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false)
	@Min(0)
	@Max(100)
	private Integer proficiency;

	@Column()
	private String documentationUrl;

	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "logo_id")
	private TechnologyImage logo;

	@Column()
	private String color;

	@ElementCollection(targetClass = TechnologyType.class)
	@CollectionTable(name = "technology_types", joinColumns = @JoinColumn(name = "technology_id"))
	@Column(name = "types", nullable = false)
	@Enumerated(EnumType.STRING)
	private List<TechnologyType> types;

	@Column()
	private Boolean isFavorite;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = true, updatable = true, insertable = false)
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at", nullable = true)
	private LocalDateTime deletedAt;

	@PrePersist
	public void prePersist() {
		LocalDateTime now = LocalDateTime.now();
		this.createdAt = now;
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	public boolean isDeleted() {
		return this.deletedAt != null;
	}
}
