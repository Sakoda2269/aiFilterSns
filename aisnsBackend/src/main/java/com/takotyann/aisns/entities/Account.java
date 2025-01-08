package com.takotyann.aisns.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="accounts")
@Data
public class Account {

	@Id
	@Column(name="account_id")
	private String accountId;
	
	private String email;
	
	private String name;
	
	private String password;
	
	private String roles;
	
	@Column(name="is_enabled")
	private Boolean isEnabled;
	
	@OneToMany(mappedBy="author")
	private List<Post> posts = new ArrayList<>();
	
	@ManyToMany
	@JoinTable(
		name="likes",
		joinColumns=@JoinColumn(name="account_id"),
		inverseJoinColumns=@JoinColumn(name="post_id")
	)
	private List<Post> likes;
	
	@ManyToMany
	@JoinTable(
		name="follows",
		joinColumns=@JoinColumn(name="follower_id"),
		inverseJoinColumns=@JoinColumn(name="followee_id")
	)
	private List<Account> followers;
	
	@ManyToMany(mappedBy="followers")
	private List<Account> followees;
	
	public void addFollower(Account account) {
		this.followers.add(account);
	}
	
	public void addFollowee(Account account) {
		this.followees.add(account);
	}
	
}
