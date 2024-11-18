package com.izg.back_end.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.model.ParticipantModel;
import com.izg.back_end.repository.ParticipantRepository;
import com.izg.back_end.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParticipantService {

	private final ParticipantRepository participantRepository;
	private final UserRepository userRepository; // 사용자 레포지토리 추가

	// 특정 작업에 참여자들 저장
	public void saveParticipants(int workIdx, List<String> userIds, String creatorUserId) {
		userIds.forEach(userId -> {
			// user_id가 유효한지 확인
			if (userRepository.existsById(userId)) {
				ParticipantModel participant = new ParticipantModel();
				participant.setEntityType("housework");
				participant.setEntityIdx(workIdx);
				participant.setUserId(userId);
				participantRepository.save(participant);
			} else {
				// 존재하지 않는 user_id 처리 로직 추가 (로그 남기기 등)
				throw new RuntimeException("User ID가 유효하지 않습니다: " + userId);
			}
		});
	}

	@Transactional
	// 특정 작업의 모든 참여자 삭제
	public void deleteParticipantsByEntityIdx(int workIdx) {
		System.out.println("Deleting participants for workIdx: " + workIdx);
		participantRepository.deleteByEntityIdxAndEntityType(workIdx, "housework");
	}

	// 특정 작업에 할당된 참여자 ID 목록을 가져오는 메서드
	public List<String> findParticipantsByWorkIdx(int workIdx) {
		return participantRepository.findAllByEntityIdxAndEntityType(workIdx, "housework").stream()
				.map(ParticipantModel::getUserId) // ParticipantModel의 userId 가져오기
				.collect(Collectors.toList());
	}

	// 특정 작업에 할당된 참여자들의 이름 목록을 가져오는 메서드
	public List<String> findParticipantNamesByWorkIdx(int workIdx) {
		return participantRepository.findAllByEntityIdxAndEntityType(workIdx, "housework").stream().map(participant -> {
			return userRepository.findById(participant.getUserId()).map(user -> user.getName()) // User 엔티티에서 이름 가져오기
					.orElse("Unknown"); // 예외 처리: 유저를 찾지 못한 경우
		}).collect(Collectors.toList());
	}

	// 모든 작업의 참여자 ID들을 가져오는 메서드
	public List<String> findAllParticipantIds() {
		return participantRepository.findAll().stream().map(ParticipantModel::getUserId).distinct()
				.collect(Collectors.toList());
	}

}
