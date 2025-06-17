package com.mj_solutions.api.unit.exception;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.exception.ForbiddenOperationException;

class ForbiddenOperationExceptionTest {

	@Test
	void testMessage() {
		ForbiddenOperationException ex = new ForbiddenOperationException("Interdit !");
		assertThat(ex.getMessage()).isEqualTo("Interdit !");
	}
}