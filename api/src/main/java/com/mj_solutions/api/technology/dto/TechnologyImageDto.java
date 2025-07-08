package com.mj_solutions.api.technology.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TechnologyImageDto {
	private Long id; // id de TechnologyImage
	private Long fileId; // id du fichier
	private String fileName; // nom du fichier
	private String url; // URL d'accès à l'image (à générer côté service)
}
