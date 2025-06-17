package com.mj_solutions.api.exception;

import lombok.Getter;

@Getter
public class RefreshTokenException extends RuntimeException {

	private final String token;

	public RefreshTokenException(String token, String message) {
		super(message);
		this.token = token;
	}
}
