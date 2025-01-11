package com.takotyann.aisns.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostDto {

	private String authorId;
	private String authorName;
	private String postId;
	private String contents;
	
}
