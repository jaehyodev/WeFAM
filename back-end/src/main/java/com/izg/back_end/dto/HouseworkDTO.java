package com.izg.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class HouseworkDTO {
	private int workIdx;
	private int familyIdx;
	private String userId;
	private String taskType;
	private String workTitle;
	private String workContent;
	private LocalDateTime deadline;
	private int points;
	private boolean completed;
	private LocalDateTime postedAt;
	private List<String> workUserIds; // 참여자 목록
	private List<String> participantNames; // 추가된 필드
	private List<String> images; // 작업과 연관된 이미지들의 Base64 문자열 리스트 추가
	private List<Map<String, Object>> participantsWithProfile; // 참가자들의 프로필 이미지 포함 정보
}
