package com.izg.back_end.service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.HouseworkLogModel;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.model.PointLogModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.HouseworkLogRepository;
import com.izg.back_end.repository.HouseworkRepository;
import com.izg.back_end.repository.PointLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseworkService {

	private final HouseworkRepository houseworkRepository;
	private final ParticipantService participantService;
	private final FileRepository fileRepository;
	private final PointLogRepository pointLogRepository;
	private final HouseworkLogRepository houseworkLogRepository;

	// 집안일 추가
	public HouseworkDTO createHousework(HouseworkDTO houseworkDTO) {
	    if (houseworkDTO.getPostedAt() == null) {
	        houseworkDTO.setPostedAt(LocalDateTime.now()); // 현재 시간을 설정
	    }
	    HouseworkModel houseworkModel = convertDtoToModel(houseworkDTO);
	    HouseworkModel savedWork = houseworkRepository.save(houseworkModel);
	    participantService.saveParticipants(savedWork.getWorkIdx(), houseworkDTO.getWorkUserIds(), houseworkDTO.getUserId());
	    return convertModelToDto(savedWork, houseworkDTO.getWorkUserIds());
	}

	// 집안일 수정
	public HouseworkDTO updateHousework(int workIdx, HouseworkDTO houseworkDTO) {
		HouseworkModel existingWork = houseworkRepository.findById(workIdx)
				.orElseThrow(() -> new RuntimeException("작업을 찾을 수 없습니다."));
		HouseworkModel houseworkModel = convertDtoToModel(houseworkDTO);
		houseworkModel.setWorkIdx(workIdx);
		HouseworkModel updatedWork = houseworkRepository.save(houseworkModel);
		participantService.deleteParticipantsByEntityIdx(workIdx);
		participantService.saveParticipants(updatedWork.getWorkIdx(), houseworkDTO.getWorkUserIds(),
				houseworkDTO.getUserId());
		return convertModelToDto(updatedWork, houseworkDTO.getWorkUserIds());
	}

	// 모든 집안일 조회
	public List<HouseworkModel> getAllWorks() {
		return houseworkRepository.findAll();
	}

	// 집안일 삭제
	@Transactional
	public void deleteWorkById(int workIdx) {
		participantService.deleteParticipantsByEntityIdx(workIdx);
		houseworkRepository.deleteById(workIdx);
	}

	// 미션 완료 처리 및 파일 업로드, 포인트 저장
	@Transactional
	public void completeHouseworkWithFiles(int workIdx, List<MultipartFile> images, int familyIdx, String userId,
			boolean completed, String entityType) throws IOException {
		// 1. 작업 완료 처리
		HouseworkModel housework = houseworkRepository.findByWorkIdx(workIdx);
		if (housework != null) {
			housework.setCompleted(completed);
			houseworkRepository.save(housework); // 작업 완료로 업데이트
		}

		// 2. 완료된 작업을 housework_log 테이블에 저장
		if (completed) {
			// 완료된 작업을 로그로 복사
			HouseworkLogModel log = new HouseworkLogModel();
			log.setWorkIdx(housework.getWorkIdx());
			log.setFamilyIdx(housework.getFamilyIdx());
			log.setUserId(userId); // 작업 완료한 유저
			log.setTaskType(housework.getTaskType());
			log.setWorkTitle(housework.getWorkTitle());
			log.setWorkContent(housework.getWorkContent());
			log.setDeadline(housework.getDeadline());
			log.setPoints(housework.getPoints());
			log.setCompleted(true); // 완료 상태로 저장
			log.setPostedAt(housework.getPostedAt());
			log.setCompletedAt(LocalDateTime.now()); // 완료된 시간 기록
			log.setEntityIdx(workIdx); // entity_idx 추가

			houseworkLogRepository.save(log); // 로그 저장
		}

		// 3. 포인트 저장 처리
		if (completed) {
			int points = housework.getPoints(); // 작업 포인트 가져오기
			PointLogModel pointLog = new PointLogModel();
			pointLog.setUserId(userId); // 포인트 적립자
			pointLog.setEntityType(entityType); // daily 또는 shortTerm 등 작업 타입
			pointLog.setEntityIdx(workIdx);
			pointLog.setPoints(points); // 적립 포인트 설정
			pointLog.setPointedAt(LocalDateTime.now()); // 적립 시간 기록

			pointLogRepository.save(pointLog); // 포인트 로그 저장
		}

		// 4. 이미지 파일 저장 처리
		for (MultipartFile image : images) {
			String fileName = image.getOriginalFilename();
			String fileExtension = fileName != null ? fileName.substring(fileName.lastIndexOf(".") + 1) : "";
			long fileSize = image.getSize();

			FileModel fileModel = new FileModel();
			fileModel.setFamilyIdx(familyIdx);
			fileModel.setUserId(userId); // 업로드한 사용자
			fileModel.setEntityType("work"); // 작업 관련 파일
			fileModel.setEntityIdx(workIdx); // 해당 작업의 workIdx
			fileModel.setFileRname(fileName); // 파일 이름
			fileModel.setFileUname(fileName + "_" + Instant.now().toEpochMilli()); // 고유한 파일 이름 생성
			fileModel.setFileSize(fileSize); // 파일 크기
			fileModel.setFileExtension(fileExtension); // 파일 확장자
			fileModel.setFileData(image.getBytes()); // 파일 데이터
			fileModel.setUploadedAt(LocalDateTime.now()); // 업로드 시간

			fileRepository.save(fileModel); // 파일 저장
		}
	}

	// DTO를 모델로 변환하는 메서드
	public HouseworkModel convertDtoToModel(HouseworkDTO dto) {
		HouseworkModel model = new HouseworkModel();
		model.setFamilyIdx(dto.getFamilyIdx());
		model.setUserId(dto.getUserId());
		model.setTaskType(dto.getTaskType());
		model.setWorkTitle(dto.getWorkTitle());
		model.setWorkContent(dto.getWorkContent());
		model.setDeadline(dto.getDeadline());
		model.setPoints(dto.getPoints());
		model.setCompleted(dto.isCompleted());
		model.setPostedAt(dto.getPostedAt());
		return model;
	}

	// 모델을 DTO로 변환하는 메서드
	public HouseworkDTO convertModelToDto(HouseworkModel model, List<String> workUserIds) {
		HouseworkDTO dto = new HouseworkDTO();
		dto.setWorkIdx(model.getWorkIdx());
		dto.setFamilyIdx(model.getFamilyIdx());
		dto.setUserId(model.getUserId());
		dto.setTaskType(model.getTaskType());
		dto.setWorkTitle(model.getWorkTitle());
		dto.setWorkContent(model.getWorkContent());
		dto.setDeadline(model.getDeadline());
		dto.setPoints(model.getPoints());
		dto.setCompleted(model.isCompleted());
		dto.setWorkUserIds(workUserIds);
		dto.setPostedAt(model.getPostedAt());
		return dto;
	}
}
