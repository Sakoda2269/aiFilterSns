package com.takotyann.aisns.config.security.filter;

import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.takotyann.aisns.config.security.AccountDetails;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtCreateFilter extends UsernamePasswordAuthenticationFilter{
	
	private final AuthenticationManager authenticationManager;
	private static final String SECRET = System.getenv("JWT_SECRET");
	
	public JwtCreateFilter(AuthenticationManager manager) {
		this.authenticationManager = manager;
		setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login", "POST"));
		
		this.setAuthenticationSuccessHandler((req, res, ex) -> {
			Date issuedAt = new Date();
			Object principal = ex.getPrincipal();
			String email = ((AccountDetails) principal).getAccount().getEmail();
			String id = ((AccountDetails) principal).getAccount().getAccountId();
			String token = JWT.create()
					.withIssuer("tako")
					.withIssuedAt(issuedAt)
					.withExpiresAt(new Date(issuedAt.getTime() + 1000 * 60 * 60))
					.withClaim("email", email)
					.withClaim("id", id)
					.withClaim("name", ex.getName())
					.withClaim("roles", ex.getAuthorities().iterator().next().toString())
					.sign(Algorithm.HMAC256(SECRET));
			res.setHeader("X-AUHT-TOKEN", token);
			res.setHeader("email", email);
			res.setStatus(200);
		});
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
	}
	
	
}
