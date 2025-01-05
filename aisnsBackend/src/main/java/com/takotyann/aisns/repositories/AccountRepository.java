package com.takotyann.aisns.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takotyann.aisns.entities.Account;

public interface AccountRepository extends JpaRepository<Account, String>{

	public Optional<Account> findByEmail(String email);
	
	public boolean existsByEmail(String email);
	
}
