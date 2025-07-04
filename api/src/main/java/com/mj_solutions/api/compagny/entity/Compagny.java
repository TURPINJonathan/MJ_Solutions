package com.mj_solutions.api.compagny.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.mj_solutions.api.compagny.dto.CompagnyType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "compagny")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Compagny {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String description;

	@Column(nullable = false)
	private String color;

	@Column()
	private String website;

	@Column(name = "contract_start_at", nullable = true)
	private LocalDateTime contractStartAt;

	@Column(name = "contract_end_at", nullable = true)
	private LocalDateTime contractEndAt;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CompagnyType type;

	@OneToMany(mappedBy = "compagny", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CompagnyImage> pictures;

	@OneToMany(mappedBy = "compagny", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CompagnyContact> contacts;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = true, insertable = false, updatable = true)
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at", nullable = true)
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
