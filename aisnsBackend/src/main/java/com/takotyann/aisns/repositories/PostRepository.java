package com.takotyann.aisns.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takotyann.aisns.entities.Post;

public interface PostRepository extends JpaRepository<Post, String>{
	
//	@Query()
//	List<Post> getFollowedPost(@Param("account_id") String accountId);
	
}
