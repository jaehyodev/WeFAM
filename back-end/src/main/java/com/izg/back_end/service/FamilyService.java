package com.izg.back_end.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.FamilyModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FamilyRepository;
import com.izg.back_end.repository.JoiningRepository;
import com.izg.back_end.repository.UserRepository;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final JoiningRepository joiningRepository;

    @Autowired
    public FamilyService(FamilyRepository familyRepository, UserRepository userRepository, JoiningRepository joiningRepository) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.joiningRepository = joiningRepository;
    }
    
    // 가족이름 조회
    public String getFamilyNameByUserId(String userId) {
        List<Integer> familyIdxList = joiningRepository.findFamilyIdxByUserId(userId);

        if (familyIdxList.isEmpty()) {
            return null; // 가족이 없는 경우 null 반환
        }

        // 하나의 가족만 가져온다고 가정 (예시)
        Integer familyIdx = familyIdxList.get(0);

        FamilyModel family = familyRepository.findById(familyIdx).orElse(null);
        return family != null ? family.getFamilyNick() : null;
    }

    public List<UserModel> getUsersByFamilyIdx(String userId) {
        List<Integer> familyIdxList = joiningRepository.findFamilyIdxByUserId(userId);

        if (familyIdxList.isEmpty()) {
            return Collections.emptyList(); // 가족이 없는 경우 빈 리스트 반환
        }

        Integer familyIdx = familyIdxList.get(0);

        return userRepository.findUsersByFamilyIdx(familyIdx);
    }
    
    public Map<String, Object> getFamilyInfoByUserId(String userId) {
        List<Integer> familyIdxList = joiningRepository.findFamilyIdxByUserId(userId);

        if (familyIdxList.isEmpty()) {
            return null; // 가족이 없는 경우 null 반환
        }

        Integer familyIdx = familyIdxList.get(0);

        FamilyModel family = familyRepository.findById(familyIdx).orElse(null);
        if (family != null) {
            Map<String, Object> familyInfo = new HashMap<>();
            familyInfo.put("familyIdx", familyIdx);
            familyInfo.put("familyName", family.getFamilyNick());
            return familyInfo;
        } else {
            return null;
        }
    }
    
 // 가족 이름 업데이트 
    public FamilyModel updateFamilyNick(FamilyModel updatedFamily) {
        FamilyModel family = familyRepository.findById(updatedFamily.getFamilyIdx())
            .orElseThrow(() -> new RuntimeException("Family not found"));

        family.setFamilyNick(updatedFamily.getFamilyNick());
        return familyRepository.save(family);
    }
    
    // 가족 가훈
    public String getFamilyMottoByUserId(String userId) {
        List<Integer> familyIdxList = joiningRepository.findFamilyIdxByUserId(userId);

        if (familyIdxList.isEmpty()) {
            return null; // 가족이 없는 경우 null 반환
        }

        Integer familyIdx = familyIdxList.get(0);
        FamilyModel family = familyRepository.findById(familyIdx).orElse(null);

        return family != null ? family.getFamilyMotto() : null;
    }

    public FamilyModel updateFamilyMotto(FamilyModel updatedFamily) {
        FamilyModel family = familyRepository.findById(updatedFamily.getFamilyIdx())
            .orElseThrow(() -> new RuntimeException("Family not found"));
        
        family.setFamilyMotto(updatedFamily.getFamilyMotto());
        return familyRepository.save(family);
    }
    
    // 가족 생성자 찾기
    public String getUserIdByFamilyIdx(int familyIdx) {
        return familyRepository.findUserIdByFamilyIdx(familyIdx);
    }
}

