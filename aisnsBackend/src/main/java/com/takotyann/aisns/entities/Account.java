package com.takotyann.aisns.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="accounts")
@Data
public class Account {

	@Id
	@Column(name="account_id")
	private String accountId;
	
	@Column(name="email")
	private String email;
	
	@Column(name="name")
	private String name;
	
	@Column(name="password")
	private String password;
	
	@Column(name="roles")
	private String roles;
	
	@Column(name="is_enabled")
	private Boolean isEnabled;
	
}
