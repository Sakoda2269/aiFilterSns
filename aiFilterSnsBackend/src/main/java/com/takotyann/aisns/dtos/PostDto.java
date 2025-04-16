package com.takotyann.aisns.dtos;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Post data to send to client.
 */

@Data
@AllArgsConstructor
public class PostDto {

	private String authorId;
	private String authorName;
	private String postId;
	private String contents;
	private Date createdDate;
	private Boolean liked;
	private Long likeCount;
	
}
