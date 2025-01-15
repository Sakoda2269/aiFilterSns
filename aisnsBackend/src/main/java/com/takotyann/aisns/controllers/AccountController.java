package com.takotyann.aisns.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.dtos.AccountDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.services.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
	
	private final AccountService accountService;
	
	public AccountController(AccountService as) {
		this.accountService = as;
	}
	
	@PostMapping("")
	public ResponseEntity<String> signup(@RequestParam("email") String email, @RequestParam("name") String name, @RequestParam("password") String password) {
		return ResponseEntity.ok(accountService.registerAccount(email, name, password));
	}
	
	@GetMapping("/{accountId}")
	public ResponseEntity<AccountDto> getAccount(@PathVariable String accountId) {
		return ResponseEntity.ok(accountService.getAccountDtoById(accountId));
	}
	
	@PutMapping("/{accountId}/follow")
	public ResponseEntity<Integer> followAccount(@PathVariable String accountId, @RequestParam("follow") boolean follow) {
		Account loginedAccount = accountService.getLoginedAccount();
		if(loginedAccount != null) {
			int res;
			if(follow) {
				res = accountService.follow(loginedAccount, accountId);
			} else {
				res = accountService.unFollow(loginedAccount, accountId);
			}
			return ResponseEntity.ok(res);
		}
		return ResponseEntity.status(401).body(-1);
	}
	
	@GetMapping("")
	public ResponseEntity<List<AccountDto>> getAccounts() {
		List<AccountDto> res = new ArrayList<>();
		for(Account account : accountService.getAllAccounts()) {
			res.add(new AccountDto(account));
		}
		return ResponseEntity.ok(res);
	}
	
}
