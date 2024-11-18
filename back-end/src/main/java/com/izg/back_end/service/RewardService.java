package com.izg.back_end.service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.PointLogModel;
import com.izg.back_end.model.RewardModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.PointLogRepository;
import com.izg.back_end.repository.RewardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RewardService {

   private final RewardRepository rewardRepository;
   private final FileRepository fileRepository;
   private final PointLogRepository pointLogRepository;
   private final PointLogService pointLogService;

   // 보상 생성 및 이미지 저장 메서드
   @Transactional
   public RewardModel createRewardWithImage(String userId, String rewardName, int rewardPoints, MultipartFile image)
         throws IOException {
      // 1. 보상 정보 생성 및 저장
      RewardModel reward = new RewardModel();
      reward.setUserId(userId);
      reward.setRewardName(rewardName);
      reward.setRewardPoint(rewardPoints);
      reward.setCreatedAt(LocalDateTime.now());
      RewardModel savedReward = rewardRepository.save(reward);

      // 2. 이미지 파일 저장
      if (image != null && !image.isEmpty()) {
         saveRewardImage(image, savedReward.getRewardIdx(), userId); // 이미지는 file 테이블에 저장
      }

      return savedReward;
   }

   // 이미지 파일 저장 메서드 (file 테이블에 저장)
   private void saveRewardImage(MultipartFile image, int rewardIdx, String userId) throws IOException {
      String fileName = image.getOriginalFilename();
      String fileExtension = fileName != null ? fileName.substring(fileName.lastIndexOf(".") + 1) : "";
      long fileSize = image.getSize();

      FileModel fileModel = new FileModel();
      fileModel.setEntityType("reward"); // 보상과 연관된 이미지로 설정
      fileModel.setEntityIdx(rewardIdx); // 보상 ID와 연결
      fileModel.setFamilyIdx(1); // familyIdx는 상황에 맞게 설정 (예시로 1)
      fileModel.setUserId(userId);
      fileModel.setFileRname(fileName);
      fileModel.setFileUname(fileName + "_" + Instant.now().toEpochMilli()); // 고유 파일 이름 생성
      fileModel.setFileExtension(fileExtension);
      fileModel.setFileSize(fileSize);
      fileModel.setFileData(image.getBytes());
      fileModel.setUploadedAt(LocalDateTime.now());

      fileRepository.save(fileModel);
   }

   // 보상 목록과 이미지 Base64를 함께 반환하는 메서드
   public List<Map<String, Object>> getRewardsWithBase64Images() {
      // 보상 목록 조회
      List<RewardModel> rewards = rewardRepository.findAll();

      // 각 보상에 Base64 인코딩된 이미지 추가
      return rewards.stream().map(reward -> {
         Map<String, Object> rewardWithImage = new HashMap<>();
         rewardWithImage.put("reward", reward);

         // 보상에 연결된 이미지 찾기
         List<FileModel> images = fileRepository.findByEntityTypeAndEntityIdx("reward", reward.getRewardIdx());
         if (!images.isEmpty()) {
            FileModel image = images.get(0);
            // 이미지 데이터를 Base64로 인코딩
            String base64File = Base64.getEncoder().encodeToString(image.getFileData());
            String base64Image = "data:image/" + image.getFileExtension() + ";base64," + base64File;
            rewardWithImage.put("imageBase64", base64Image); // Base64 인코딩된 이미지 추가
         }
         return rewardWithImage;
      }).collect(Collectors.toList());
   }

   // 보상 수정 메서드
   @Transactional
   public RewardModel updateRewardWithImage(int rewardIdx, String rewardName, int rewardPoints, MultipartFile image)
         throws IOException {
      // 1. 기존 보상 정보 조회
      RewardModel reward = rewardRepository.findById(rewardIdx)
            .orElseThrow(() -> new IllegalArgumentException("해당 보상이 존재하지 않습니다."));

      // 2. 보상 정보 업데이트
      reward.setRewardName(rewardName);
      reward.setRewardPoint(rewardPoints);
      RewardModel updatedReward = rewardRepository.save(reward);

      // 3. 이미지가 존재하면 업데이트
      if (image != null && !image.isEmpty()) {
         // 기존 이미지를 삭제
         List<FileModel> existingImages = fileRepository.findByEntityTypeAndEntityIdx("reward", rewardIdx);
         if (!existingImages.isEmpty()) {
            for (FileModel existingImage : existingImages) {
               fileRepository.delete(existingImage); // 기존 이미지 삭제
            }
         }
         // 새 이미지 저장
         saveRewardImage(image, rewardIdx, reward.getUserId()); // 이미지는 file 테이블에 저장
      }

      return updatedReward;
   }

   // 보상 삭제 메서드
   @Transactional
   public void deleteReward(int rewardIdx) {
      // 1. 보상 정보 삭제
      rewardRepository.deleteById(rewardIdx);

      // 2. 보상과 관련된 이미지도 삭제
      fileRepository.deleteByEntityTypeAndEntityIdx("reward", rewardIdx);
   }

   // 보상구매시 업데이트
   @Transactional
   public RewardModel purchaseReward(int rewardIdx, String userId) {
      // 1. 구매할 보상 정보 조회
      RewardModel reward = rewardRepository.findById(rewardIdx)
            .orElseThrow(() -> new IllegalArgumentException("해당 보상이 존재하지 않습니다."));

      // 2. 유저의 현재 총 포인트 확인
      int userPoints = pointLogService.getTotalPointsByUserId(userId);
      if (userPoints < reward.getRewardPoint()) {
         throw new IllegalStateException("포인트가 부족합니다.");
      }

      // 3. 포인트 차감 로그 기록 (음수 포인트로 기록)
      PointLogModel pointLog = new PointLogModel();
      pointLog.setUserId(userId);
      pointLog.setEntityType("buy"); // 구매 시 차감 로그임을 나타냄
      pointLog.setEntityIdx(reward.getRewardIdx());
      pointLog.setPoints(-reward.getRewardPoint()); // 음수로 포인트 차감
      pointLogRepository.save(pointLog); // 로그 저장

      // 4. 보상 상태는 업데이트하지 않음 (isSold를 변경하지 않음)
      // reward.setSold(false); // 상태 변경하지 않음

      return rewardRepository.save(reward); // 보상 정보 저장
   }

   // 구매된 보상 목록과 이미지 Base64를 함께 반환하는 메서드
   public List<Map<String, Object>> getPurchasedRewardsWithBase64Images(String userId) {
       // 포인트 로그에서 구매 항목 조회
       List<PointLogModel> purchaseLogs = pointLogRepository.findPurchaseLogsByUserId(userId);
       System.out.println("purchaseLogs : " + purchaseLogs);

       // 각 로그에 해당하는 보상 데이터를 조회
       return purchaseLogs.stream().map(log -> {
           Map<String, Object> rewardWithImage = new HashMap<>();
           System.out.println("로그 엔터티 식별자 : " + log.getEntityIdx());
           // 보상 정보 가져오기 (log의 entity_idx가 reward의 reward_idx와 동일)
           RewardModel reward = rewardRepository.findById(log.getEntityIdx())
                   .orElseThrow(() -> new IllegalArgumentException("해당 보상이 존재하지 않습니다."));

           rewardWithImage.put("reward", reward);
           rewardWithImage.put("purchaseDate", log.getPointedAt());  // 구매 일자 추가

           // 보상에 연결된 이미지 찾기
           List<FileModel> images = fileRepository.findByEntityTypeAndEntityIdx("reward", reward.getRewardIdx());
           if (!images.isEmpty()) {
               FileModel image = images.get(0);
               String base64File = Base64.getEncoder().encodeToString(image.getFileData());
               String base64Image = "data:image/" + image.getFileExtension() + ";base64," + base64File;
               rewardWithImage.put("imageBase64", base64Image);  // Base64 인코딩된 이미지 추가
           }

           return rewardWithImage;
       }).collect(Collectors.toList());
   }

}