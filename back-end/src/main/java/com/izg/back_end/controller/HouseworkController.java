package com.izg.back_end.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.HouseworkDTO;
import com.izg.back_end.dto.ImageUploadDto;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.HouseworkLogModel;
import com.izg.back_end.model.HouseworkModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.HouseworkLogRepository;
import com.izg.back_end.repository.UserRepository;
import com.izg.back_end.service.HouseworkService;
import com.izg.back_end.service.ParticipantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HouseworkController {

	private final HouseworkService houseworkService;
	private final HouseworkLogRepository houseworkLogRepository;
	private final ParticipantService participantService;
	private final FileRepository fileRepository;
	private final UserRepository userRepository;

	// 집안일 추가
	@PostMapping("/add-work")
	public HouseworkDTO addWork(@RequestBody HouseworkDTO houseworkDTO) {
		return houseworkService.createHousework(houseworkDTO);
	}

	// 집안일 수정
	@PutMapping("/update-work/{workIdx}")
	public HouseworkDTO updateWork(@PathVariable("workIdx") int workIdx, @RequestBody HouseworkDTO houseworkDTO) {
		return houseworkService.updateHousework(workIdx, houseworkDTO);
	}

	// 집안일 불러오기
	@GetMapping("/get-works")
	public ResponseEntity<Map<String, Object>> getAllWorks(@RequestParam("userId") String userId) {
		List<HouseworkModel> works = houseworkService.getAllWorks();
		List<HouseworkDTO> result = new ArrayList<>();

		// 참가자와 사용자 정보 미리 가져오기
		List<String> allParticipantIds = participantService.findAllParticipantIds();
		Map<String, UserModel> userMap = getAllUsers(allParticipantIds); // 사용자 정보 가져오기

		for (HouseworkModel work : works) {
			List<String> participantIds = participantService.findParticipantsByWorkIdx(work.getWorkIdx());
			List<String> participantNames = new ArrayList<>();
			List<Map<String, Object>> participantsWithProfile = new ArrayList<>();

			for (String participantId : participantIds) {
				UserModel user = userMap.get(participantId);
				if (user != null) {
					participantNames.add(user.getName());
					Map<String, Object> profileData = new HashMap<>();
					profileData.put("id", user.getId());
					profileData.put("name", user.getName());
					profileData.put("profileImg", user.getProfileImg());
					participantsWithProfile.add(profileData);
				}
			}

			// 이미지 파일 처리
			List<FileModel> files = fileRepository.findByEntityTypeAndEntityIdx("work", work.getWorkIdx());
			List<String> images = convertFilesToBase64(files);

			// DTO로 변환
			HouseworkDTO dto = houseworkService.convertModelToDto(work, participantIds);
			dto.setParticipantNames(participantNames);
			dto.setImages(images);
			dto.setParticipantsWithProfile(participantsWithProfile);

			result.add(dto);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("works", result);

		return ResponseEntity.ok(response);
	}

	// 모든 사용자의 완료된 작업 목록 가져오기
	@GetMapping("/completed-works")
	public List<Map<String, Object>> getCompletedWorks() {
		List<HouseworkLogModel> completedWorks = houseworkLogRepository.findAll();
		List<Map<String, Object>> result = new ArrayList<>();

		// 완료한 사용자 정보 미리 가져오기
		List<String> userIds = completedWorks.stream().map(HouseworkLogModel::getUserId).distinct()
				.collect(Collectors.toList());

		Map<String, UserModel> userMap = getAllUsers(userIds);

		for (HouseworkLogModel log : completedWorks) {
			List<FileModel> files = fileRepository.findByEntityTypeAndEntityIdx("work", log.getEntityIdx());

			// 이미지 파일 처리
			List<String> images = convertFilesToBase64(files);

			// 작업을 완료한 사용자 정보 추가
			Map<String, Object> logWithImages = new HashMap<>();
			UserModel user = userMap.get(log.getUserId());
			if (user != null) {
				logWithImages.put("userProfileImg", user.getProfileImg());
				logWithImages.put("userName", user.getName());
			}

			logWithImages.put("workLog", log);
			logWithImages.put("images", images);

			result.add(logWithImages);
		}

		return result;
	}

	// 특정 사용자의 완료된 작업 목록 가져오기
	@GetMapping("/completed-user-works")
	public ResponseEntity<List<Map<String, Object>>> getUserCompletedWorks(@RequestParam("userId") String userId) {
		List<HouseworkLogModel> completedWorks = houseworkLogRepository.findAllByUserId(userId);
		List<Map<String, Object>> result = new ArrayList<>();

		Map<String, UserModel> userMap = getAllUsers(List.of(userId));

		for (HouseworkLogModel log : completedWorks) {
			List<FileModel> files = fileRepository.findByEntityTypeAndEntityIdx("work", log.getEntityIdx());

			// 이미지 파일 처리
			List<String> images = convertFilesToBase64(files);

			// 사용자 정보
			Map<String, Object> logWithImages = new HashMap<>();
			UserModel user = userMap.get(userId);
			if (user != null) {
				logWithImages.put("userProfileImg", user.getProfileImg());
				logWithImages.put("userName", user.getName());
			}

			logWithImages.put("workLog", log);
			logWithImages.put("images", images);

			result.add(logWithImages);
		}

		return ResponseEntity.ok(result);
	}

	// 집안일 삭제
	@DeleteMapping("/delete-work/{workIdx}")
	public ResponseEntity<String> deleteWork(@PathVariable("workIdx") int workIdx) {
		try {
			houseworkService.deleteWorkById(workIdx);
			return ResponseEntity.ok("작업이 성공적으로 삭제되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("작업 삭제 중 오류가 발생했습니다.");
		}
	}

	// 사용자 정보를 한 번에 가져오는 메서드 추가
	private Map<String, UserModel> getAllUsers(List<String> userIds) {
		List<UserModel> users = userRepository.findAllById(userIds);
		Map<String, UserModel> userMap = new HashMap<>();
		for (UserModel user : users) {
			userMap.put(user.getId(), user);
		}
		return userMap;
	}

	// 이미지 파일을 Base64로 변환하는 메서드 분리
	private List<String> convertFilesToBase64(List<FileModel> files) {
		List<String> images = new ArrayList<>();
		for (FileModel file : files) {
			try {
				String base64File = Base64.getEncoder().encodeToString(file.getFileData());
				images.add("data:image/" + file.getFileExtension() + ";base64," + base64File);
			} catch (Exception e) {
				System.err.println("Error encoding image: " + e.getMessage());
			}
		}
		return images;
	}

	@PostMapping("/complete-with-files")
	public ResponseEntity<String> completeHouseworkWithFiles(@ModelAttribute ImageUploadDto dto,
			@RequestParam("completed") boolean completed) {
		try {
			// 작업 ID 및 Entity Type 확인용 출력
			System.out.println("entityIdx: " + dto.getEntityIdx());
			System.out.println("entityType: " + dto.getEntityType());

			// 이미지 리스트 (MultipartFile로 변환된 파일들)
			List<MultipartFile> images = dto.getImages();

			// Service 호출 - 이미지와 관련된 파일 업로드 및 작업 완료 처리
			houseworkService.completeHouseworkWithFiles(dto.getEntityIdx(), // 작업 ID
					images, // 업로드할 이미지 리스트
					dto.getFamilyIdx(), // familyIdx (가족 ID)
					dto.getUserId(), // userId (사용자 ID)
					completed, // 작업 완료 여부
					dto.getEntityType() // 작업 유형 (daily, shortTerm 등)
			);

			// 작업 성공 시 성공 메시지 반환
			return ResponseEntity.ok("작업 완료 및 이미지 저장 완료");

		} catch (IOException e) {
			// 파일 저장 중 오류 발생 시 에러 메시지 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 중 오류 발생");
		}
	}
}