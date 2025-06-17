package com.mj_solutions.api.auth.dto;

import lombok.Data;

@Data
public class RefreshTokenRequest {
	private String refreshToken;
}
