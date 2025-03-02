package com.takotyann.aisns.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.exceptions.LoginRequireException;
import com.takotyann.aisns.services.AccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final AccountService accountService;
	
	@GetMapping("")
	public ResponseEntity<String> isLogined() {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			throw new LoginRequireException("unAuthorized");
		}
		return ResponseEntity.ok(account.getAccountId());
	}
	
}
