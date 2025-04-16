package com.takotyann.aisns.services;

import org.springframework.stereotype.Service;

import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.entities.Like;
import com.takotyann.aisns.entities.LikeId;
import com.takotyann.aisns.exceptions.LoginRequireException;
import com.takotyann.aisns.exceptions.PostNotFoundException;
import com.takotyann.aisns.repositories.LikeRepository;

import lombok.RequiredArgsConstructor;

/**
 * Process about like.
 */
@Service
@RequiredArgsConstructor
public class LikeService {
	
	private final LikeRepository likeRepository;
	private final AccountService accountService;
	
	/**
	 * Logined account like a post whose postId is pid.
	 * @param pid postId to like.
	 * @return Number of like of post.
	 */
	public int like(String pid) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			throw new LoginRequireException("unAuthorized");
		}
		Like like = new Like(account.getAccountId(), pid);
		likeRepository.save(like);
		return likeRepository.countLikeByPostId(pid);
	}
	
	/**
	 * Logined account unlike post whose postId is pid.
	 * @param pid postId of post to unlike.
	 * @return Number of like of post.
	 */
	public int unLike(String pid) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			throw new LoginRequireException("unAuthorized");
		}
		LikeId lid = new LikeId(account.getAccountId(), pid);
		Like like = likeRepository.findById(lid).orElseThrow(() -> new PostNotFoundException("post not found"));
		likeRepository.delete(like);
		return likeRepository.countLikeByPostId(pid);
	}
	
}
