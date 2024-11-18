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
@Table(name = "participant")
@Data
public class ParticipantModel {
	@Id
	@Column(name = "participant_idx")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("participantIdx")
	private int participantIdx = 0; // 기본값 0

	@Column(name = "entity_type")
	@JsonProperty("entityType")
	private String entityType = ""; // 기본값 빈 문자열

	@Column(name = "entity_idx")
	@JsonProperty("entityIdx")
	private int entityIdx = 0; // 기본값 0

	@Column(name = "user_id")
	@JsonProperty("userId")
	private String userId = ""; // 기본값 빈 문자열

}
