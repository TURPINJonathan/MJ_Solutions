package com.mj_solutions.api.project.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.mj_solutions.api.compagny.entity.Compagny;
import com.mj_solutions.api.project.dto.ProjectDeveloperRole;
import com.mj_solutions.api.project.dto.ProjectStatus;
import com.mj_solutions.api.technology.entity.Technology;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String title;

	@Column()
	private String subtitle;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false)
	private String slug;

	@Column()
	private String url;

	@Column(nullable = true)
	private String githubUrl;

	@Column()
	private List<ProjectDeveloperRole> developerRoles;

	@Column(name = "status", nullable = false)
	@Enumerated(EnumType.STRING)
	private ProjectStatus status;

	@ManyToMany
	@JoinTable(name = "project_technology", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "technology_id"))
	private List<Technology> technologies;

	@ManyToMany
	@JoinTable(name = "project_compagny", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "compagny_id"))
	private List<Compagny> companies;

	@Column()
	private Boolean isOnline;

	@Embedded
	private ProjectMedia media;

	@Column(name = "created_at", updatable = false, nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = true)
	private LocalDateTime updatedAt;

	@Column(name = "published_at", nullable = true)
	private LocalDateTime publishedAt;

	@Column(name = "archived_at", nullable = true)
	private LocalDateTime archivedAt;

	@Column(name = "deleted_at", nullable = true)
	private LocalDateTime deletedAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
		if (this.status == ProjectStatus.PUBLISHED) {
			this.publishedAt = LocalDateTime.now();
		} else if (this.status == ProjectStatus.ARCHIVED) {
			this.archivedAt = LocalDateTime.now();
		}
	}

	public boolean isDraft() {
		return this.status == ProjectStatus.DRAFT;
	}

	public boolean isPublished() {
		return this.status == ProjectStatus.PUBLISHED;
	}

	public boolean isArchived() {
		return this.status == ProjectStatus.ARCHIVED;
	}

	public boolean isDeleted() {
		return this.deletedAt != null;
	}

	public boolean isOnline() {
		return this.isOnline != null && this.isOnline;
	}
}
