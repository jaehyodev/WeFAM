package com.izg.back_end.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "`like`")
@Data
public class LikeModel {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_idx")
    @JsonProperty("likeIdx")
    private int likeIdx;
	
	@Column(name = "user_id")
    @JsonProperty("userId")
    private String userId;
	
	@Column(name = "feed_idx")
    @JsonProperty("feed_idx")
    private int feedIdx;
}