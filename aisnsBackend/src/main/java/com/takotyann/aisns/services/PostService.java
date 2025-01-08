package com.takotyann.aisns.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

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
		post.setAuthor(author);
		post.setContents(contents);
		postRepository.save(post);
		return id;
	}
	
//	public List<Post> getTimeline(Account account) {
//		
//	}
	
}
