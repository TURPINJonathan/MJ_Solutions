package com.mj_solutions.api.unit.exception;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.mj_solutions.api.exception.ValidationExceptionHandler;

class ValidationExceptionHandlerTest {

	@Test
	void handleValidationExceptions_shouldReturnBadRequestAndErrors() {
		FieldError fieldError = new FieldError("object", "email", "must not be blank");
		BindingResult bindingResult = mock(BindingResult.class);
		when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

		MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
		when(ex.getBindingResult()).thenReturn(bindingResult);

		ValidationExceptionHandler handler = new ValidationExceptionHandler();
		ResponseEntity<Map<String, String>> response = handler.handleValidationExceptions(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody()).containsEntry("email", "must not be blank");
	}
}
