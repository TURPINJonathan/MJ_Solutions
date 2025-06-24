package com.mj_solutions.api.auth.dto;

import com.mj_solutions.api.applicationuser.dto.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
	private String token;
	private String refreshToken;
	private UserResponse user;
}
