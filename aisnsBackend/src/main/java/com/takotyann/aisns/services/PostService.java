package com.takotyann.aisns.services;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.takotyann.aisns.dtos.PostDto;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.entities.Post;
import com.takotyann.aisns.repositories.PostRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PostService {
	
	private final PostRepository postRepository;
	
	public String post(Account author, String contents) {
		Post post = new Post();
		String id = UUID.randomUUID().toString();
		post.setPostId(id);
		post.setAuthorId(author.getAccountId());
		post.setContents(contents);
		postRepository.save(post);
		return id;
	}
	
	public Page<PostDto> getTimeline(Account account, int page) {
		var tmp = postRepository.getFollowedPost(account.getAccountId(), PageRequest.of(page, 10));
		return tmp;
	}
	
}
