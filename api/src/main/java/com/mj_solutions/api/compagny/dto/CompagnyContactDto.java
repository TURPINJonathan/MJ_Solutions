package com.mj_solutions.api.compagny.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompagnyContactDto {
	private Long id;
	private String lastname;
	private String firstname;
	private String position;
	private String email;
	private String phone;
	private Long pictureId;
	private String pictureUrl;
}
