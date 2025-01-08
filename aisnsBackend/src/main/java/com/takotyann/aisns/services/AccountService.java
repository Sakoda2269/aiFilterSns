package com.takotyann.aisns.services;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.takotyann.aisns.config.security.AccountDetails;
import com.takotyann.aisns.entities.Account;
import com.takotyann.aisns.exceptions.EmailConflictException;
import com.takotyann.aisns.repositories.AccountRepository;

@Service
public class AccountService {

	private final AccountRepository accountRepository;
	private final PasswordEncoder encoder;
	
	public AccountService(AccountRepository accountRepo, PasswordEncoder pe) {
		accountRepository = accountRepo;
		encoder = pe;
	}
	
	public void registerAccount(String email, String name, String password) {
		if(accountRepository.existsByEmail(email)) {
			throw new EmailConflictException("this email has already used");
		}
		Account account = new Account();
		account.setEmail(email);
		account.setName(name);
		account.setPassword(encoder.encode(password));
		account.setAccountId(UUID.randomUUID().toString());
		account.setRoles("ROLE_GENERAL");
		account.setIsEnabled(false);
		accountRepository.save(account);
	}
	
	public Account getLoginedAccount() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth != null && auth.isAuthenticated()) {
			Object principal = auth.getPrincipal();
			if(principal instanceof AccountDetails) {
				String accountId = ((AccountDetails) principal).getUsername();
				Account account = accountRepository.findById(accountId).orElseThrow();
				return account;
			}
		}
		return null;
	}
	
	
}
