package com.takotyann.aisns.repositories;

import java.util.Optional;

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
					p.created_date AS created_date,
					FALSE AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				ORDER BY p.created_date DESC;
				""",
		nativeQuery=true
	)
	Page<PostDto> getAllPost(Pageable pageable);
	
	@Query(
		value="""
				SELECT 
					a.account_id AS author_id, 
					a.name AS author_name, 
					p.post_id AS post_id, 
					p.contents AS contents,
					p.created_date AS created_date,
					CASE
						WHEN EXISTS(
							SELECT *
							FROM likes
							WHERE likes.post_id = p.post_id AND likes.account_id = :account_id
						) THEN TRUE
						ELSE FALSE
					END AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				ORDER BY p.created_date DESC;
				""",
				nativeQuery = true
	)
	Page<PostDto> getAllPost(@Param("account_id") String accountId, Pageable pageable);

	@Query(
			value="""
					SELECT 
						a.account_id AS author_id, 
						a.name AS author_name, 
						p.post_id AS post_id, 
						p.contents AS contents,
						p.created_date AS created_date,
						CASE
							WHEN EXISTS(
								SELECT *
								FROM likes
								WHERE likes.post_id = p.post_id AND likes.account_id = :account_id
							) THEN TRUE
							ELSE FALSE
						END AS liked,
						COALESCE(like_count.like_count, 0) AS like_count
					FROM posts p
					INNER JOIN accounts a
					ON p.author_id = a.account_id
					LEFT JOIN (
						SELECT
							post_id,
							COUNT(1) AS like_count
						FROM likes
						GROUP BY post_id
					) AS like_count
					USING(post_id)
					WHERE 
						p.author_id IN  (
							SELECT account_id
							FROM follows
							WHERE follower_id = :account_id
						) OR
						p.author_id = :account_id
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
					p.created_date AS created_date,
					FALSE AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					WEHRE post_id = :post_id
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				WHERE p.post_id = :post_id;
					""",
			nativeQuery=true)
	Optional<PostDto> findPostById(@Param("post_id")String id);
	
	@Query(
			value="""
				SELECT 
					a.account_id AS author_id, 
					a.name AS author_name, 
					p.post_id AS post_id, 
					p.contents AS contents,
					p.created_date AS created_date,
					CASE
						WHEN EXISTS(
							SELECT *
							FROM likes
							WHERE account_id = :account_id AND likes.post_id = p.post_id
						) THEN TRUE
						ELSE FALSE
					END AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					WEHRE post_id = :post_id
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				WHERE p.post_id = :post_id;
					""",
			nativeQuery=true)
	Optional<PostDto> findPostById(@Param("post_id")String id, @Param("account_id")String accountId);
	
	@Query(value="""
				SELECT 
					a.account_id AS author_id, 
					a.name AS author_name, 
					p.post_id AS post_id, 
					p.contents AS contents,
					p.created_date AS created_date,
					FALSE AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					WEHRE post_id = :post_id
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				WHERE a.account_id = :account_id
				ORDER BY p.created_date DESC;
			""",
			nativeQuery=true)
	Page<PostDto> getPostsByAccountId(@Param("account_id") String accountId, Pageable pageble);
	
	@Query(value="""
				SELECT 
					a.account_id AS author_id, 
					a.name AS author_name, 
					p.post_id AS post_id, 
					p.contents AS contents,
					p.created_date AS created_date,
					CASE
						WHEN EXISTS(
							SELECT *
							FROM likes
							WHERE likes.post_id = p.post_id AND likes.account_id = :getter_id
						) THEN TRUE
						ELSE FALSE
					END AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				WHERE a.account_id = :account_id
				ORDER BY p.created_date DESC;
			""",
			nativeQuery=true)
	Page<PostDto> getPostsByAccountId(@Param("account_id") String accountId, @Param("getter_id") String getterId, Pageable pageble);

	@Query(
			value="""
				SELECT 
					a.account_id AS author_id, 
					a.name AS author_name, 
					p.post_id AS post_id, 
					p.contents AS contents,
					p.created_date AS created_date,
					TRUE AS liked,
					COALESCE(like_count.like_count, 0) AS like_count
				FROM posts p
				INNER JOIN accounts a
				ON p.author_id = a.account_id
				LEFT JOIN (
					SELECT
						post_id,
						COUNT(1) AS like_count
					FROM likes
					GROUP BY post_id
				) AS like_count
				USING(post_id)
				WHERE 
					p.post_id IN (
							SELECT post_id
							FROM likes
							WHERE account_id = :account_id
					)
				ORDER BY p.created_date DESC;
			""",
			nativeQuery=true
	)
	Page<PostDto> getLikedPost(@Param("account_id") String accountId, Pageable pageable);
	
}
