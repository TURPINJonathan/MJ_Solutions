package com.mj_solutions.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenResponse {
	private String accessToken;
	private String refreshToken;
}
