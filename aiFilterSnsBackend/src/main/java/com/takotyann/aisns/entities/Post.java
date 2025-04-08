package com.takotyann.aisns.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="posts")
@Data
public class Post {

	@Id
	@Column(name="post_id")
	private String postId;
	
	@Column(name="author_id")
	private String authorId;
	
	@Column(name="contents")
	private String contents;
	
	@Column(name="created_date")
	private LocalDateTime  createdDate;
	
}
