package com.takotyann.aisns.config.security.filter;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;

public class JwtRequestHeaderAuthenticationFilter extends RequestHeaderAuthenticationFilter{
	
	public JwtRequestHeaderAuthenticationFilter(AuthenticationManager manager) {
		setPrincipalRequestHeader("Authorization");
		setExceptionIfHeaderMissing(false);
		setAuthenticationManager(manager);
	}
	
}
