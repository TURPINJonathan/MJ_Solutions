package com.mj_solutions.api.exception;

public class ForbiddenOperationException extends RuntimeException {
	public ForbiddenOperationException(String message) {
		super(message);
	}
}
