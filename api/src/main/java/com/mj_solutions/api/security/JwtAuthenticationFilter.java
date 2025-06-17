package com.mj_solutions.api.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mj_solutions.api.repository.ApplicationUserRepository;
import com.mj_solutions.api.service.BlacklistService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final BlacklistService blacklistService;
	private final ApplicationUserRepository userRepository;
	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {

		String path = request.getServletPath();
		if (path.equals("/auth/login") || path.equals("/auth/register")) {
			filterChain.doFilter(request, response);
			return;
		}

		String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7);

		if (blacklistService.isTokenBlacklisted(token)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		String email;
		try {
			email = jwtUtils.getEmailFromToken(token);
		} catch (Exception e) {
			filterChain.doFilter(request, response);
			return;
		}

		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			userRepository.findByEmail(email).ifPresent(user -> {
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
						user, null, user.getAuthorities());
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			});
		}

		filterChain.doFilter(request, response);
	}
}