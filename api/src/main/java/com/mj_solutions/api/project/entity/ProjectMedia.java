package com.mj_solutions.api.project.entity;

import java.util.List;

import com.mj_solutions.api.file.entity.File;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class ProjectMedia {
	@ManyToMany
	private List<File> picture;

	@ManyToMany
	private List<File> video;
}
