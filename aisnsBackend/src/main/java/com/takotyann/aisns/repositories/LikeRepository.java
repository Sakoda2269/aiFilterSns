package com.takotyann.aisns.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.takotyann.aisns.entities.Like;
import com.takotyann.aisns.entities.LikeId;

public interface LikeRepository extends JpaRepository<Like, LikeId>{
	
	@Query(value="""
			SELECT
				COUNT(1)
			FROM likes
			WHERE post_id = :post_id
			""",
			nativeQuery=true)
	Integer countLikeByPostId(@Param("post_id") String postId);
	
}
