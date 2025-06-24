package com.mj_solutions.api.file.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class CompressFileUtils {
	public static byte[] compress(byte[] data) throws IOException {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try (GZIPOutputStream gzip = new GZIPOutputStream(bos)) {
			gzip.write(data);
		}
		return bos.toByteArray();
	}

	public static byte[] decompress(byte[] compressed) throws IOException {
		ByteArrayInputStream bis = new ByteArrayInputStream(compressed);
		try (GZIPInputStream gzip = new GZIPInputStream(bis)) {
			return gzip.readAllBytes();
		}
	}
}