package com.takotyann.aisns.dtos;

import com.takotyann.aisns.entities.Account;

import lombok.Data;

@Data
public class AccountDto {
	
	private String name;
	private String accountId;
	private int followerNum;
	private int followeeNum;
	private boolean isFollowing;

	public AccountDto(Account account) {
		name = account.getName();
		accountId = account.getAccountId();
	}
	
	
	
}
