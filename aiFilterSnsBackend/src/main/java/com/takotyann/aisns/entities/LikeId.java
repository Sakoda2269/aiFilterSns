package com.takotyann.aisns.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class LikeId implements Serializable{
	
	private String accountId;
	private String postId;
	
	public LikeId() {}
	
	public LikeId(String accountId, String postId) {
		this.accountId = accountId;
		this.postId = postId;
	}
	
	@Override
	public boolean equals(Object o) {
		if(this == o) return true;
		if(o == null || getClass() != o.getClass()) return false;
		LikeId lid = (LikeId) o;
		return lid.getAccountId().equals(accountId) && lid.getPostId().equals(postId);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(accountId, postId);
	}
}
