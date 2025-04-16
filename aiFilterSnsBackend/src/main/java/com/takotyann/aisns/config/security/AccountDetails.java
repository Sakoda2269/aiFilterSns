package com.takotyann.aisns.config.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.takotyann.aisns.entities.Account;

import java.util.Arrays;

import lombok.Getter;

/**
 * 		Account Detail used by authentication.
 */

@Getter
public class AccountDetails extends User{
	
	private final Account account;
	public AccountDetails(Account account) {
		super(account.getAccountId(), account.getPassword(), 
				Arrays.asList(account.getRoles().split(",")).stream().map(role -> new SimpleGrantedAuthority(role)).toList()
			);
		this.account = account;
	}
	
}
