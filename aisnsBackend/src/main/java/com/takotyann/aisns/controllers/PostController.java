package com.takotyann.aisns.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.services.AccountService;
import com.takotyann.aisns.services.PostService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/post")
@RestController
@RequiredArgsConstructor
public class PostController {
	
	private final AccountService accountService;
	private final PostService postService;
	
//	@GetMapping("")
//	public List<Post> getTimeline() {
//		
//	}
	
	@PostMapping("")
	public void post(@RequestParam("contents") String contents) {
		Account account = accountService.getLoginedAccount();
		if(account != null) {
			postService.post(account, contents);
		}
	}
	
	
}
