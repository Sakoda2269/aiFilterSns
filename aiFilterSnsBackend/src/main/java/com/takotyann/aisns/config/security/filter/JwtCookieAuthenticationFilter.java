package com.takotyann.aisns.config.security.filter;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public class JwtCookieAuthenticationFilter extends AbstractPreAuthenticatedProcessingFilter{

	public JwtCookieAuthenticationFilter(AuthenticationManager manager) {
		super.setAuthenticationManager(manager);
	}
	
	@Override
	protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
		Cookie cookie = WebUtils.getCookie(request, "token");
		if(cookie != null) {
			return cookie.getValue();
		}
		return null;
	}

	@Override
	protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
		return "N/A";
	}

}
