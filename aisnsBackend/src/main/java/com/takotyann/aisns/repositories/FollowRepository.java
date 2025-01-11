package com.takotyann.aisns.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.takotyann.aisns.entities.Follow;
import com.takotyann.aisns.entities.FollowId;

public interface FollowRepository extends JpaRepository<Follow, FollowId>{
	
	@Query(nativeQuery=true,
			value="""
					SELECT COUNT(1) FROM follows WHERE followee_id = :account_id
					""")
	Integer getFollowerNum(@Param("account_id") String accountId);
	
	@Query(nativeQuery=true,
			value="""
					SELECT COUNT(1) FROM follows WHERE follower_id = :account_id
					""")
	Integer getFolloweeNum(@Param("account_id") String accountId);
	
	@Query(nativeQuery=true,
			value="""
					SELECT EXISTS(SELECT 1 FROM follows WHERE follower_id = :account_id AND followee_id = :other_id)
					"""
			)
	Boolean isFollowing(@Param("account_id") String accountId, @Param("other_id") String otherId);
	
}
