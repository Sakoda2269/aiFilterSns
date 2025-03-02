package com.takotyann.aisns.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class FollowId implements Serializable{
	
	private String followerId;
	private String accountId;
	
	public FollowId() {}
	
	public FollowId(String followerId, String accountId) {
		this.accountId = accountId;
		this.followerId = followerId;
	}
	
	@Override
	public boolean equals(Object o) {
		if(this == o) return true;
		if(o == null || getClass() != o.getClass()) return false;
		FollowId fid = (FollowId)o;
		return fid.getAccountId().equals(accountId) && fid.getFollowerId().equals(followerId);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(followerId, accountId);
	}
	
	
}
