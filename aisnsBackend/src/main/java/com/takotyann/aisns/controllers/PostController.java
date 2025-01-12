package com.takotyann.aisns.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.takotyann.aisns.dtos.PostDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.services.AccountService;
import com.takotyann.aisns.services.PostService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/posts")
@RestController
@RequiredArgsConstructor
public class PostController {
	
	private final AccountService accountService;
	private final PostService postService;
	
	@GetMapping("")
	public ResponseEntity<Page<PostDto>> getTimeline(@RequestParam(name = "page", defaultValue="0") int pageNum) {
		return ResponseEntity.ok(postService.getTimeLine(pageNum));
	}
	
	@GetMapping("/follows")
	public ResponseEntity<Page<PostDto>> getFollowTimeline(@RequestParam(name = "page", defaultValue="0") int pageNum) {
		Account account = accountService.getLoginedAccount();
		if(account != null) {
			return ResponseEntity.ok(postService.getFollowTimeline(account, 0));
		}
		return ResponseEntity.status(401).body(null);
	}
	
	@PostMapping("")
	public void post(@RequestParam("contents") String contents) {
		Account account = accountService.getLoginedAccount();
		if(account != null) {
			postService.post(account, contents);
		}
	}
	
	
}
