package com.izg.back_end.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.RewardModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.UserRepository;
import com.izg.back_end.service.PointLogService;
import com.izg.back_end.service.RewardService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class RewardController {

   private final RewardService rewardService;
   private final PointLogService pointLogService;
   private final UserRepository userRepository;

   @PostMapping("/rewards")
   public ResponseEntity<RewardModel> createReward(@RequestParam("userId") String userId,
         @RequestParam("rewardName") String rewardName, @RequestParam("rewardPoints") Integer rewardPoints,
         @RequestParam("image") MultipartFile image // 이미지는 따로 저장
   ) {
      try {
         // 보상 정보와 이미지를 각각 저장
         RewardModel savedReward = rewardService.createRewardWithImage(userId, rewardName, rewardPoints, image);
         return ResponseEntity.ok(savedReward);
      } catch (Exception e) {
         return ResponseEntity.status(500).build();
      }
   }

   // 보상 목록 조회 API (이미지 Base64 포함)
   @GetMapping("/rewards")
   public ResponseEntity<List<Map<String, Object>>> getRewards() {
      List<Map<String, Object>> rewardsWithImages = rewardService.getRewardsWithBase64Images();
      return ResponseEntity.ok(rewardsWithImages);
   }

   // 보상 수정 API
   @PostMapping("/rewards/{rewardIdx}/update")
   public ResponseEntity<RewardModel> updateReward(@PathVariable("rewardIdx") int rewardIdx, // 파라미터 이름 명시
         @RequestParam("rewardName") String rewardName, @RequestParam("rewardPoints") Integer rewardPoints,
         @RequestParam(value = "image", required = false) MultipartFile image // 이미지는 선택 사항
   ) {
      try {
         // 보상 정보와 이미지를 각각 업데이트
         RewardModel updatedReward = rewardService.updateRewardWithImage(rewardIdx, rewardName, rewardPoints, image);
         return ResponseEntity.ok(updatedReward);
      } catch (Exception e) {
         return ResponseEntity.status(500).build();
      }
   }

   // 보상 삭제 API
   @PostMapping("/rewards/{rewardIdx}/delete")
   public ResponseEntity<Void> deleteReward(@PathVariable("rewardIdx") int rewardIdx) {
      try {
         rewardService.deleteReward(rewardIdx);
         return ResponseEntity.ok().build();
      } catch (Exception e) {
         return ResponseEntity.status(500).build();
      }
   }

   // 보상 구매 API
   @PostMapping("/rewards/{rewardIdx}/purchase")
   public ResponseEntity<RewardModel> purchaseReward(@PathVariable("rewardIdx") int rewardIdx,
         @RequestParam("userId") String userId) {
      try {
         RewardModel reward = rewardService.purchaseReward(rewardIdx, userId);
         return ResponseEntity.ok(reward);
      } catch (Exception e) {
         return ResponseEntity.status(500).build();
      }
   }

   // 구매한 보상 목록 조회 API
   @GetMapping("/rewards/purchased/{userId}")
   public ResponseEntity<List<Map<String, Object>>> getPurchasedRewards(@PathVariable("userId") String userId) {
       List<Map<String, Object>> purchasedRewardsWithImages = rewardService
               .getPurchasedRewardsWithBase64Images(userId);
       System.out.println(purchasedRewardsWithImages);
       return ResponseEntity.ok(purchasedRewardsWithImages);
   }

   // 사용자별 총 포인트와 프로필 이미지 가져오기 API
   @GetMapping("/get-user-data")
   public ResponseEntity<Map<String, Object>> getUserData(@RequestParam("userId") String userId) {
      Map<String, Object> userData = new HashMap<>();

      // 사용자 정보 가져오기
      Optional<UserModel> userOptional = userRepository.findById(userId);
      if (userOptional.isPresent()) {
         UserModel user = userOptional.get();
         userData.put("id", user.getId());
         userData.put("name", user.getName());
         userData.put("profileImg", user.getProfileImg()); // 프로필 이미지 추가
      }

      // 사용자 총 포인트 가져오기
      Integer totalPoints = pointLogService.getTotalPointsByUserId(userId);
      userData.put("points", totalPoints);

      return ResponseEntity.ok(userData);
   }
}