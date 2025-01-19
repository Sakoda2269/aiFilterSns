package com.takotyann.aisns.services;

import java.util.Date;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.takotyann.aisns.dtos.PostDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.entities.Post;
import com.takotyann.aisns.exceptions.PermissionDeniedException;
import com.takotyann.aisns.exceptions.PostNotFoundException;
import com.takotyann.aisns.repositories.PostRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PostService {
	
	private final PostRepository postRepository;
	private final AccountService accountService;
	
	public String post(Account author, String contents) {
		Post post = new Post();
		String id = UUID.randomUUID().toString();
		post.setPostId(id);
		post.setAuthorId(author.getAccountId());
		post.setContents(contents);
		post.setCreatedDate(new Date());
		postRepository.save(post);
		return id;
	}
	
	public Page<PostDto> getTimeLine(int page) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.getAllPost(PageRequest.of(page, 10));
		} else {
			return postRepository.getAllPost(account.getAccountId(), PageRequest.of(page, 10));
		}
	}
	
	public Page<PostDto> getFollowTimeline(Account account, int page) {
		var tmp = postRepository.getFollowedPost(account.getAccountId(), PageRequest.of(page, 10));
		return tmp;
	}
	
	public Page<PostDto> getLikedPosts(String accountId, int page) {
		return postRepository.getLikedPost(accountId, PageRequest.of(page, 10));
	}
	
	public PostDto getPost(String pid) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.findPostById(pid).orElseThrow(() -> new PostNotFoundException("post not found"));
		} else {
			return postRepository.findPostById(pid, account.getAccountId()).orElseThrow(() -> new PostNotFoundException("post not found"));
		}
	}
	
	public void deletePost(String pid) {
		Account account = accountService.getLoginedAccount();
		PostDto post = getPost(pid);
		if(account.getAccountId().equals(post.getAuthorId())) {
			postRepository.deleteById(pid);
			return;
		} else {
			throw new PermissionDeniedException("you can't delete this post");
		}
	}
	
	public void editPost(String pid, String newContents) {
		Account account = accountService.getLoginedAccount();
		PostDto post = getPost(pid);
		if(account.getAccountId().equals(post.getAuthorId())) {
			Post newPost = postRepository.findById(pid).orElseThrow(() -> new PostNotFoundException("post not found"));
			newPost.setContents(newContents);
			postRepository.save(newPost);
			return;
		} else {
			throw new PermissionDeniedException("you can't edit this post");
		}
	}
	
	public Page<PostDto> getAccountPosts(String aid, int page) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.getPostsByAccountId(aid, PageRequest.of(page, 10));
		} else {
			return postRepository.getPostsByAccountId(aid, account.getAccountId(), PageRequest.of(page, 10));
		}
	}
	
}
