package com.mj_solutions.api.utils;

import java.text.Normalizer;
import java.util.Locale;

public class StringUtils {
	private StringUtils() {
		// Prevent instantiation
	}

	public static String capitalize(String str) {
		if (str == null || str.isEmpty())
			return str;
		return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
	}

	public static String generateSlug(String input) {
		if (input == null)
			return null;
		String slug = input.toLowerCase(Locale.ROOT);
		slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
		slug = slug.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
		slug = slug.replaceAll("[’'\",.?!:;()\\[\\]{}]", "");
		slug = slug.replaceAll("[^a-z0-9\\s-]", "-");
		slug = slug.replaceAll("[\\s-]+", "-");
		slug = slug.replaceAll("^-|-$", "");

		return slug;
	}
}
