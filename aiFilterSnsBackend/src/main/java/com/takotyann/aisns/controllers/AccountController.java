package com.takotyann.aisns.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.dtos.AccountDto;
import com.takotyann.aisns.dtos.PostDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.services.AccountService;
import com.takotyann.aisns.services.PostService;

import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * 		Receive request and send response about accounts.
 */

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
	
	private final AccountService accountService;
	private final PostService postService;
	
	@PostMapping("")
	public ResponseEntity<String> signup(@RequestParam("email") String email, @RequestParam("name") String name, @RequestParam("password") String password) {
		return ResponseEntity.ok(accountService.registerAccount(email, name, password));
	}
	
	@GetMapping("/{accountId}")
	public ResponseEntity<AccountDto> getAccount(@PathVariable String accountId) {
		return ResponseEntity.ok(accountService.getAccountDtoById(accountId));
	}
	
	@PostMapping("/delete")
	public ResponseEntity<String> deleteAccount(@RequestParam(name="password") String password, HttpServletResponse res) {
		
		accountService.deleteAccount(password, res);
		return ResponseEntity.ok("delete success");
	}
	
	@GetMapping("/{accountId}/posts")
	public ResponseEntity<Page<PostDto>> getAccountPosts(@PathVariable String accountId, @RequestParam(name="page", defaultValue="0") int pageNum) {
		return ResponseEntity.ok(postService.getAccountPosts(accountId, pageNum));
	}
	
	@GetMapping("/{accountId}/posts/likes")
	public ResponseEntity<Page<PostDto>> getAccountLikedPosts(@PathVariable String accountId, @RequestParam(name="page", defaultValue="0") int pageNum) {
		return ResponseEntity.ok(postService.getLikedPosts(accountId, pageNum));
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
