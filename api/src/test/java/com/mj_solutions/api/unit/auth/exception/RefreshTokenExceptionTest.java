package com.mj_solutions.api.unit.auth.exception;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.auth.exception.RefreshTokenException;

class RefreshTokenExceptionTest {

	@Test
	void testMessage() {
		RefreshTokenException ex = new RefreshTokenException("token123", "Erreur !");
		assertThat(ex.getMessage()).isEqualTo("Erreur !");
		assertThat(ex.getToken()).isEqualTo("token123");
	}
}
