package com.takotyann.aisns.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.takotyann.aisns.dtos.PostDto;
import com.takotyann.aisns.entities.Post;

public interface PostRepository extends JpaRepository<Post, String>{
	
	@Query(
			value="""
					SELECT 
						a.account_id AS author_id, 
						a.name AS author_name, 
						p.post_id AS post_id, 
						p.contents AS contents,
						p.created_date AS created_date 
					FROM posts p 
					INNER JOIN accounts a
					ON p.author_id = a.account_id
					WHERE p.author_id IN (
						SELECT account_id
						FROM follows
						WHERE follower_id = :account_id
					) OR p.author_id = :account_id
					ORDER BY p.created_date DESC;
					""",
			nativeQuery=true
			)
	Page<PostDto> getFollowedPost(@Param("account_id") String accountId, Pageable pageable);
	
	@Query(
		value="""
				SELECT 
					a.account_id AS author_id, 
					a.name AS author_name, 
					p.post_id AS post_id, 
					p.contents AS contents,
					p.created_date AS created_date
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				ORDER BY p.created_date DESC;
				""",
		nativeQuery=true
	)
	Page<PostDto> getAllPost(Pageable pageable);
}
