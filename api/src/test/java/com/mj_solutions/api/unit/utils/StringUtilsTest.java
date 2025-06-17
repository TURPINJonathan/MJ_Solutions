package com.mj_solutions.api.unit.utils;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.mj_solutions.api.utils.StringUtils;

class StringUtilsTest {

	@Test
	void capitalize_shouldCapitalizeFirstLetter() {
		assertThat(StringUtils.capitalize("hello")).isEqualTo("Hello");
	}

	@Test
	void capitalize_shouldReturnNullIfNull() {
		assertThat(StringUtils.capitalize(null)).isNull();
	}

	@Test
	void capitalize_shouldReturnEmptyIfEmpty() {
		assertThat(StringUtils.capitalize("")).isEmpty();
	}

	@Test
	void capitalize_shouldLowercaseRest() {
		assertThat(StringUtils.capitalize("hELLO")).isEqualTo("Hello");
	}

	@Test
	void capitalize_shouldWorkWithOneLetter() {
		assertThat(StringUtils.capitalize("a")).isEqualTo("A");
		assertThat(StringUtils.capitalize("A")).isEqualTo("A");
	}
}
