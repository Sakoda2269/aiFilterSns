package com.takotyann.aisns.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="follows")
public class Follow {

	@EmbeddedId
	private FollowId followId;
}
