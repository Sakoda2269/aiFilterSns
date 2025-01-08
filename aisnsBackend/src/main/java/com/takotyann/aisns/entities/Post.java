package com.takotyann.aisns.entities;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

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
	
	@Column(name="created_date")
	@CreatedDate
	private Date createdDate;
	
	@ManyToMany(mappedBy="likes")
	private List<Account> likers;
	
	
}
