package com.mj_solutions.api.applicationuser.dto;

import java.time.LocalDateTime;

import com.mj_solutions.api.common.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
	private Long id;
	private String firstname;
	private String lastname;
	private String email;
	private Role role;
	private LocalDateTime createdAt;
}
