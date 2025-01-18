package com.takotyann.aisns.services;

import org.springframework.stereotype.Service;

import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.entities.Like;
import com.takotyann.aisns.entities.LikeId;
import com.takotyann.aisns.exceptions.LoginRequireException;
import com.takotyann.aisns.exceptions.PostNotFoundException;
import com.takotyann.aisns.repositories.LikeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {
	
	private final LikeRepository likeRepository;
	private final AccountService accountService;
	
	public void like(String pid) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			throw new LoginRequireException("unAuthorized");
		}
		Like like = new Like(account.getAccountId(), pid);
		likeRepository.save(like);
	}
	
	public void unLike(String pid) {
		Account account = accountService.getLoginedAccount();
		if(account == null) {
			throw new LoginRequireException("unAuthorized");
		}
		LikeId lid = new LikeId(account.getAccountId(), pid);
		Like like = likeRepository.findById(lid).orElseThrow(() -> new PostNotFoundException("post not found"));
		likeRepository.delete(like);
	}
	
}
