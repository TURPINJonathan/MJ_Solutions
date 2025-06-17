package com.mj_solutions.api.security;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${app.jwtExpirationMs}")
	private int jwtExpirationMs;

	private SecretKey jwtSecret;

	@PostConstruct
	public void init() {
		byte[] decodedKey = Base64.getDecoder().decode(secret);
		this.jwtSecret = Keys.hmacShaKeyFor(decodedKey);
	}

	public String generateJwtToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
				.signWith(jwtSecret, SignatureAlgorithm.HS512)
				.compact();
	}

	public String getEmailFromToken(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(jwtSecret)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
}
