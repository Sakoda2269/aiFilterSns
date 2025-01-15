package com.takotyann.aisns.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/logout")
public class LogoutController {

	private static final boolean IS_SECURE = Boolean.parseBoolean(System.getenv("SECURE"));
	
	@PostMapping
	public ResponseEntity<String> logout(HttpServletResponse res) {
		Cookie cookie = new Cookie("token", null);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setSecure(IS_SECURE);
		res.addCookie(cookie);
		return ResponseEntity.ok("logout success");
	}
	
}
