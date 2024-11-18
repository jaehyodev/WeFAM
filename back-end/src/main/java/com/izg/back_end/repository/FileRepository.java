package com.izg.back_end.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.izg.back_end.model.FileModel;

public interface FileRepository extends JpaRepository<FileModel, Integer> {

	@Modifying
    @Query("DELETE FROM FileModel f WHERE f.entityType = :entityType AND f.entityIdx = :entityIdx")
    void deleteByEntityTypeAndEntityIdx(@Param("entityType") String entityType, @Param("entityIdx") Integer entityIdx);
	List<FileModel> findByEntityTypeAndEntityIdx(String entityType, int entityIdx);
	
	
	// familyIdx와 entityType을 기준으로 파일 리스트를 가져오는 메서드
    List<FileModel> findByFamilyIdxAndEntityType(int familyIdx, String entityType);
	
	List<FileModel> findByEntityIdx(int entityIdx);
	
	// familyIdx를 기준으로 파일 리스트를 가져오는 메서드
    List<FileModel> findByFamilyIdx(int familyIdx);
    //날짜별 이미지 검색 메서드
    List<FileModel> findByFamilyIdxAndUploadedAtBetween(int familyIdx, LocalDateTime startDate, LocalDateTime endDate);
    
 // 최신의 가족 프로필 사진을 가져오는 메서드 (업로드 날짜 기준)
    FileModel findLatestByFamilyIdxAndEntityType(int familyIdx, String entityType);

}
