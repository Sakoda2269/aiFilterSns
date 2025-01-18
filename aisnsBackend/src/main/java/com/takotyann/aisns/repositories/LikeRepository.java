package com.takotyann.aisns.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takotyann.aisns.entities.Like;
import com.takotyann.aisns.entities.LikeId;

public interface LikeRepository extends JpaRepository<Like, LikeId>{
	
}
