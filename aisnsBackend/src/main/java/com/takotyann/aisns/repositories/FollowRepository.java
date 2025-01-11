package com.takotyann.aisns.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takotyann.aisns.entities.Follow;
import com.takotyann.aisns.entities.FollowId;

public interface FollowRepository extends JpaRepository<Follow, FollowId>{

}
