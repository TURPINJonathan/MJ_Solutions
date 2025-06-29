package com.mj_solutions.api.utils;

public class StringUtils {
	private StringUtils() {
		// Prevent instantiation
	}

	public static String capitalize(String str) {
		if (str == null || str.isEmpty())
			return str;
		return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
	}
}
