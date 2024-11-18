package com.izg.back_end.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.JoiningModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.JoiningRepository;
import com.izg.back_end.repository.UserRepository;

@Service
public class JoiningService {

	@Autowired
	private JoiningRepository joiningRepository;

	@Autowired
	private UserRepository userRepository;

	public JoiningModel getJoiningByUserId(String userId) {
		return joiningRepository.findByUserId(userId);
	}

	public List<Map<String, Object>> getMembersByUserId(String userId) {
		// userId를 사용해 familyIdx를 조회
		List<Integer> familyIdxList = joiningRepository.findFamilyIdxByUserId(userId);

		if (familyIdxList == null || familyIdxList.isEmpty()) {
			System.out.println("Family Index not found for userId: " + userId);
			return null;
		}

		Integer familyIdx = familyIdxList.get(0); // 첫 번째 familyIdx 사용
		System.out.println("Found Family Index: " + familyIdx);

		// familyIdx로 구성원 목록을 조회하고, 각 구성원의 userId로 UserModel을 조회하여 name 정보를 함께 가져옴
		List<JoiningModel> joiningMembers = joiningRepository.findByFamilyIdx(familyIdx);
		System.out.println("Found " + joiningMembers.size() + " family members.");

		List<Map<String, Object>> familyMembers = new ArrayList<>();
		for (JoiningModel joiningMember : joiningMembers) {
			System.out.println("Processing User ID: " + joiningMember.getUserId());

			// Optional에서 UserModel을 가져옴
			UserModel user = userRepository.findById(joiningMember.getUserId()).orElse(null);
			if (user != null) {
				Map<String, Object> memberInfo = new HashMap<>();
				memberInfo.put("userId", joiningMember.getUserId());
				memberInfo.put("name", user.getName());
				System.out.println("Fetched User Name: " + user.getName());
				// 필요한 다른 정보도 추가 가능
				familyMembers.add(memberInfo);
			} else {
				System.out.println("User not found for ID: " + joiningMember.getUserId());
			}
		}

		return familyMembers;
	}
}
