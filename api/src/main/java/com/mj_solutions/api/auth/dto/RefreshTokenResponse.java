package com.mj_solutions.api.auth.dto;

import com.mj_solutions.api.applicationuser.dto.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenResponse {
	private String accessToken;
	private String refreshToken;
	private UserResponse user;
}
