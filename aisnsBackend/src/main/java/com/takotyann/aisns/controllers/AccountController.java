package com.takotyann.aisns.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.services.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
	
	private final AccountService accountService;
	
	public AccountController(AccountService as) {
		this.accountService = as;
	}
	
	@PostMapping("/signup")
	public Map<String, String> signup(@RequestParam("email") String email, @RequestParam("name") String name, @RequestParam("password") String password) {
		accountService.registerAccount(email, name, password);
		Map<String, String> res = new HashMap<>();
		res.put("result", "success");
		return res;
	}
	
	@PutMapping("/{accountId}/follow")
	public ResponseEntity<String> followUser(@PathVariable String accountId) {
		Account loginedAccount = accountService.getLoginedAccount();
		if(loginedAccount != null) {
			accountService.follow(loginedAccount, accountId);
			return ResponseEntity.ok("follow success");
		}
		return ResponseEntity.status(401).body("unAuthorized");
	}
	
}
