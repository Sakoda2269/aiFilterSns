package com.takotyann.aisns.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
	
	@GetMapping("/test")
	public String test() {
		return "hello";
	}
	
}
