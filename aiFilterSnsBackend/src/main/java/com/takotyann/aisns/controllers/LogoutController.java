package com.takotyann.aisns.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.services.AccountService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/logout")
@RequiredArgsConstructor
public class LogoutController {

	private final AccountService accountService;
	
	@PostMapping
	public ResponseEntity<String> logout(HttpServletResponse res) {
		accountService.logout(res);
		return ResponseEntity.ok("logout success");
	}
	
}
