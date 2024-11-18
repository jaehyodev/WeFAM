package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.FamilyModel;
import com.izg.back_end.service.FamilyService;

@RestController
public class FamilyController {

	@Autowired
	private FamilyService familyService;


	// 가족 이름 업데이트
	@PutMapping("/update-family-nick")
	public ResponseEntity<FamilyModel> updateFamilyNick(@RequestBody FamilyModel updatedFamily) {
		try {
			FamilyModel savedFamily = familyService.updateFamilyNick(updatedFamily);
			return ResponseEntity.ok(savedFamily);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	// 가족 이름 조회 엔드포인트
	@GetMapping("/get-family-nick/{userId}")
	public ResponseEntity<String> getFamilyNick(@PathVariable("userId") String userId) {
		try {
			String familyNick = familyService.getFamilyNameByUserId(userId);
			return ResponseEntity.ok(familyNick);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	// 가족 가훈 업데이트
	@PutMapping("/update-family-motto")
	public ResponseEntity<FamilyModel> updateFamilyMotto(@RequestBody FamilyModel updatedFamily) {
		try {
			FamilyModel savedFamily = familyService.updateFamilyMotto(updatedFamily);
			return ResponseEntity.ok(savedFamily);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	// 가족 가훈 조회 엔드포인트
	@GetMapping("/get-family-motto/{userId}")
	public ResponseEntity<String> getFamilyMotto(@PathVariable("userId") String userId) {
		try {
			String familyMotto = familyService.getFamilyMottoByUserId(userId);
			return ResponseEntity.ok(familyMotto);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}
	
	// 가족 생성자 조회 엔드포인트
	@GetMapping("/family/user-id/{familyIdx}")
    public ResponseEntity<String> getUserIdByFamilyIdx(@PathVariable("familyIdx") int familyIdx) {
		
		 try {
		        String userId = familyService.getUserIdByFamilyIdx(familyIdx);
		        return ResponseEntity.ok(userId); // 응답을 JSON 형식으로 반환
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user ID");
		    }
    }
}