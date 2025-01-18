package com.takotyann.aisns.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="likes")
public class Like {
	
	@EmbeddedId
	private LikeId likeId;
	
	public Like(String aid, String pid) {
		this.likeId = new LikeId(aid, pid);
	}
	
}
