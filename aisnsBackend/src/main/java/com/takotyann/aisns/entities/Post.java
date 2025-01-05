package com.takotyann.aisns.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="posts")
@Data
public class Post {

	@Id
	@Column(name="post_id")
	private String postId;
	
	@ManyToOne
	@JoinColumn(name="account_id")
	private Account author;
	
	private String contents;
	
	@ManyToMany(mappedBy="likes")
	private List<Account> likers;
	
	
}
