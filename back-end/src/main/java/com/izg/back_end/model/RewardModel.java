package com.izg.back_end.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "reward")
public class RewardModel {
	
	@Id
	@Column(name = "reward_idx")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("rewardIdx")
	private int rewardIdx;
	
	@Column(name = "user_id")
	@JsonProperty("userId")
	private String userId;
	
	@Column(name = "reward_name")
	@JsonProperty("rewardName")
	private String rewardName;
	
	@Column(name = "reward_point")
	@JsonProperty("rewardPoint")
	private int rewardPoint;
	
	@Column(name = "is_sold")
	@JsonProperty("isSold")
	private boolean isSold;
	
	@Column(name = "purchase")
	@JsonProperty("purchase")
	private String purchase;
	
	@Column(name = "sold_At")
	@JsonProperty("soldAt")
	private LocalDateTime soldAt;
	
	@Column(name = "created_At")
	@JsonProperty("createdAt")
	private LocalDateTime createdAt;
}
