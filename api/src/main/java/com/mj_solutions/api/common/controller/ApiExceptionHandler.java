package com.mj_solutions.api.common.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
		HttpStatus status = HttpStatus.BAD_REQUEST;

		if (ex instanceof IllegalArgumentException) {
			status = HttpStatus.UNPROCESSABLE_ENTITY;
		}

		Map<String, Object> body = new HashMap<>();
		body.put("success", false);
		body.put("message", ex.getMessage());
		body.put("timestamp", LocalDateTime.now());
		body.put("status", status.value());

		return ResponseEntity.status(status).body(body);
	}
}