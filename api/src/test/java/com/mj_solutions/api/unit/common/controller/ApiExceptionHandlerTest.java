package com.mj_solutions.api.unit.common.controller;

import static org.assertj.core.api.Assertions.*;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import com.mj_solutions.api.common.controller.ApiExceptionHandler;

class ApiExceptionHandlerTest {

	private final ApiExceptionHandler handler = new ApiExceptionHandler();

	@Test
	void handleException_shouldReturn422ForIllegalArgument() {
		IllegalArgumentException ex = new IllegalArgumentException("bad arg");
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		assertThat(response.getStatusCode().value()).isEqualTo(422);
		assertThat(response.getBody()).containsEntry("success", false);
		assertThat(response.getBody()).containsEntry("message", "bad arg");
		assertThat(response.getBody()).containsKey("timestamp");
		assertThat(response.getBody()).containsEntry("status", 422);
	}

	@Test
	void handleException_shouldReturn400ForOtherException() {
		Exception ex = new Exception("other");
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		assertThat(response.getStatusCode().value()).isEqualTo(400);
		assertThat(response.getBody()).containsEntry("success", false);
		assertThat(response.getBody()).containsEntry("message", "other");
		assertThat(response.getBody()).containsKey("timestamp");
		assertThat(response.getBody()).containsEntry("status", 400);
	}

	@Test
	void handleException_shouldReturn400ForRuntimeException() {
		NullPointerException ex = new NullPointerException("null pointer");
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		assertThat(response.getStatusCode().value()).isEqualTo(400);
		assertThat(response.getBody()).containsEntry("success", false);
		assertThat(response.getBody()).containsEntry("message", "null pointer");
		assertThat(response.getBody()).containsKey("timestamp");
		assertThat(response.getBody()).containsEntry("status", 400);
	}

	@Test
	void handleException_shouldHandleNullMessage() {
		Exception ex = new Exception();
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		assertThat(response.getStatusCode().value()).isEqualTo(400);
		assertThat(response.getBody()).containsEntry("success", false);
		assertThat(response.getBody()).containsEntry("message", null);
		assertThat(response.getBody()).containsKey("timestamp");
		assertThat(response.getBody()).containsEntry("status", 400);
	}

	@Test
	void handleException_shouldReturnAllExpectedKeys() {
		Exception ex = new Exception("test");
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		assertThat(response.getBody()).containsKeys("success", "message", "timestamp", "status");
	}

	@Test
	void handleException_shouldReturnCorrectTypesInBody() {
		Exception ex = new Exception("types");
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		Map<String, Object> body = response.getBody();
		assertThat(body).isNotNull();
		assertThat(body.get("success")).isInstanceOf(Boolean.class);
		assertThat(body.get("timestamp")).isNotNull();
		assertThat(body.get("status")).isInstanceOf(Integer.class);
	}

	@Test
	void handleException_shouldReturnCurrentTimestamp() {
		Exception ex = new Exception("now");
		ResponseEntity<Map<String, Object>> response = handler.handleException(ex);

		Map<String, Object> body = response.getBody();
		assertThat(body).isNotNull();
		assertThat(body.get("timestamp")).isNotNull();
	}
}