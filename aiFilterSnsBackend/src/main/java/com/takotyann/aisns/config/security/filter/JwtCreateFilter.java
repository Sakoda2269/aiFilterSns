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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtCreateFilter extends UsernamePasswordAuthenticationFilter{
	
	private final AuthenticationManager authenticationManager;
	private static final String SECRET = System.getenv("JWT_SECRET");
	private static final long EXPIARTION_TIME = 86400000;//1 day
	
	private static final boolean IS_SECURE = Boolean.parseBoolean(System.getenv("SECURE"));
	
	public JwtCreateFilter(AuthenticationManager manager) {
		this.authenticationManager = manager;
		setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login", "POST"));
		
		this.setAuthenticationSuccessHandler((req, res, ex) -> {
			Date issuedAt = new Date();
			Object principal = ex.getPrincipal();
			String id = ((AccountDetails) principal).getAccount().getAccountId();
			String name = ((AccountDetails) principal).getAccount().getName();
			String token = JWT.create()
					.withIssuer("tako")
					.withIssuedAt(issuedAt)
					.withExpiresAt(new Date(issuedAt.getTime() + EXPIARTION_TIME))
					.withClaim("account_id", id)
					.withClaim("name", name)
					.withClaim("roles", ex.getAuthorities().iterator().next().toString())
					.sign(Algorithm.HMAC256(SECRET));
			
			Cookie cookie = new Cookie("token", token);
			cookie.setHttpOnly(true);
			cookie.setSecure(IS_SECURE);
			cookie.setPath("/");
			cookie.setMaxAge(24 * 60 * 60);//1 day
			res.addCookie(cookie);
			
//			res.setHeader("X-AUHT-TOKEN", token);
//			res.setHeader("email", email);
			res.setHeader("X-ACCOUNT-ID", id);
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
