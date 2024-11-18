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
@Table(name = "point_log")
public class PointLogModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "point_idx")
	@JsonProperty("pointIdx")
	private int pointIdx;

	@Column(name = "user_id")
	@JsonProperty("userId")
	private String userId;

	@Column(name = "entity_type")
	@JsonProperty("entityType")
	private String entityType;

	@Column(name = "entity_idx")
	@JsonProperty("entityIdx")
	private int entityIdx;

	@Column(name = "points")
	@JsonProperty("points")
	private int points;

	@Column(name = "pointed_at")
	@JsonProperty("pointedAt")
	private LocalDateTime pointedAt = LocalDateTime.now();

}
