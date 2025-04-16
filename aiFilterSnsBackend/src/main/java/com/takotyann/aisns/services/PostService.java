package com.takotyann.aisns.services;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.takotyann.aisns.dtos.PostDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.entities.Post;
import com.takotyann.aisns.exceptions.PermissionDeniedException;
import com.takotyann.aisns.exceptions.PostNotFoundException;
import com.takotyann.aisns.repositories.PostRepository;

import java.util.UUID;

import lombok.RequiredArgsConstructor;

/**
 * Process about post.
 */
@Service
@RequiredArgsConstructor
public class PostService {
	
	private final PostRepository postRepository;
	private final AccountService accountService;
	
	/**
	 * Register a new post.
	 * @param author Post's author.
	 * @param contents Post's contents.
	 * @return id of new post.
	 */
	public String post(Account author, String contents) {
		Post post = new Post();
		String id = UUID.randomUUID().toString();
		post.setPostId(id);
		post.setAuthorId(author.getAccountId());
		post.setContents(contents);
		System.out.println(ZonedDateTime.now(ZoneId.of("Asia/Tokyo")).toLocalDateTime());
		post.setCreatedDate(ZonedDateTime.now(ZoneId.of("Asia/Tokyo")).toLocalDateTime());
		postRepository.save(post);
		return id;
	}
	
	/**
	 * Get timeline. Timelien has all posts sorted by created date. A page has 10 posts. 
	 * @param page Number of page. page 1 -> post1 ~ post10. page 2 -> post11 ~ post20.
	 * @return Timeline.
	 */
	public Page<PostDto> getTimeLine(int page) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.getAllPost(PageRequest.of(page, 10));
		} else {
			return postRepository.getAllPost(account.getAccountId(), PageRequest.of(page, 10));
		}
	}
	/**
	 * Get timeline of logined account. Timeline has logined account's posts and logined account's followers' posts sorted created date. A page has 10 posts. 
	 * @param account
	 * @param page Page number.
	 * @return Timeline.
	 */
	public Page<PostDto> getFollowTimeline(Account account, int page) {
		var tmp = postRepository.getFollowedPost(account.getAccountId(), PageRequest.of(page, 10));
		return tmp;
	}
	
	/**
	 * Get posts that account whose id is accountId liked. A page has 10 posts.
	 * @param accountId Account id you want to get liked posts
	 * @param page Page number.
	 * @return Liked posts.
	 */
	public Page<PostDto> getLikedPosts(String accountId, int page) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.getLikedPost(accountId, PageRequest.of(page, 10));
		} else {
			return postRepository.getLikedPost(accountId, account.getAccountId(),  PageRequest.of(page, 10));
		}
	}
	
	/**
	 * Get Post whose postId is pid. Throw PostNotFoundException if post is not found.
	 * @param pid Id of post you want to get.
	 * @return post
	 */
	public PostDto getPost(String pid) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.findPostById(pid).orElseThrow(() -> new PostNotFoundException("post not found"));
		} else {
			return postRepository.findPostById(pid, account.getAccountId()).orElseThrow(() -> new PostNotFoundException("post not found"));
		}
	}
	
	/**
	 * Delete post whose postId is pid. 
	 * @throws PermissionDeniedException Logined account is not post author.
	 * @throws PostNotFoundException Post is not found.
	 * @param pid
	 */
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
	
	/**
	 * Edit post whose postId is pid. 
	 * @throws PostNotFoundException Post is not found.
	 * @throws PermissionDeniedException Logined account is not post author.
	 * @param pid Id of post you want to edit.
	 * @param newContents Edited contents.
	 */
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
	
	/**
	 * Get all posts whose author is account whose accountId is aid.
	 * @param aid AccountId of the author of the post you want to get.
	 * @param page Page number.
	 * @return posts.
	 */
	public Page<PostDto> getAccountPosts(String aid, int page) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			return postRepository.getPostsByAccountId(aid, PageRequest.of(page, 10));
		} else {
			return postRepository.getPostsByAccountId(aid, account.getAccountId(), PageRequest.of(page, 10));
		}
	}
	
}
