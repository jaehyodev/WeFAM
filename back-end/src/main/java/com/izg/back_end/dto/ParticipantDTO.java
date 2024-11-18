package com.izg.back_end.dto;

import lombok.Data;

@Data
public class ParticipantDTO {
	private int participantIdx;
	private String userId;
	private int workIdx; // 집안일의 인덱스
}