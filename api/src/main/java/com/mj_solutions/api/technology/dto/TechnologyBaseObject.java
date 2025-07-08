package com.mj_solutions.api.technology.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public abstract class TechnologyBaseObject {

	private String name;
	private String description;
	private Integer proficiency;
	private String documentationUrl;
	private String color;
	private TechnologyImageDto logo;
	private TechnologyType[] types;
	private Boolean isFavorite;
}
