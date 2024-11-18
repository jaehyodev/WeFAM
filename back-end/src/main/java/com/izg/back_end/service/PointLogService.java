package com.izg.back_end.service;

import org.springframework.stereotype.Service;

import com.izg.back_end.repository.PointLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointLogService {

	private final PointLogRepository pointLogRepository;

	// 특정 사용자의 총 포인트 합계를 가져오는 메서드
	public Integer getTotalPointsByUserId(String userId) {
		Integer totalPoints = pointLogRepository.getTotalPointsByUserId(userId);
		return totalPoints != null ? totalPoints : 0; // null일 경우 0 반환
	}
	
	
}
