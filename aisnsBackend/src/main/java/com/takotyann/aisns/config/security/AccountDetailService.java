package com.takotyann.aisns.config.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.repositories.AccountRepository;

@Service
public class AccountDetailService implements UserDetailsService{

	private final AccountRepository repository;
	
	public AccountDetailService(AccountRepository repo) {
		this.repository = repo;
	}
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Account account = repository.findByEmail(email).orElseThrow(
			() -> new UsernameNotFoundException("Account not found")
		);
		return new AccountDetails(account);
	}

}
