package com.takotyann.aisns.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	
	@PostMapping("")
	public void post(@RequestParam("contents") String contents) {
		Account account = accountService.getLoginedAccount();
		if(account != null) {
			postService.post(account, contents);
		}
	}
	
	@GetMapping("/{pid}")
	public ResponseEntity<PostDto> getPost(@PathVariable String pid) {
		return ResponseEntity.ok(postService.getPost(pid));
	}
	
	@DeleteMapping("/{pid}")
	public ResponseEntity<String> deletePost(@PathVariable String pid) {
		postService.deletePost(pid);
		return ResponseEntity.ok("delete success");
	}
	
	@PutMapping("/{pid}")
	public ResponseEntity<String> editPost(@PathVariable String pid, @RequestParam(name="contents") String contents) {
		postService.editPost(pid, contents);
		return ResponseEntity.ok("edit success");
	}
	
	@GetMapping("/follows")
	public ResponseEntity<Page<PostDto>> getFollowTimeline(@RequestParam(name = "page", defaultValue="0") int pageNum) {
		Account account = accountService.getLoginedAccount();
		if(account != null) {
			return ResponseEntity.ok(postService.getFollowTimeline(account, 0));
		}
		return ResponseEntity.status(401).body(null);
	}
	
	
	
}
