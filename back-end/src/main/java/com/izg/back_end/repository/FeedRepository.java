package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;

import jakarta.transaction.Transactional;

@Repository
public interface FeedRepository extends JpaRepository<FeedModel, Integer> {

    /**
     * 특정 가족(familyIdx)에 속하는 피드를 페이징 처리하여 조회
     * 
     * @param familyIdx 가족의 고유 ID
     * @param pageable 페이징 정보 (페이지 번호, 페이지 크기, 정렬 정보)
     * @return 해당 가족에 속하는 피드를 페이징 처리한 결과 (Page 객체)
     */
    Page<FeedModel> findAllByFamilyIdx(Integer familyIdx, Pageable pageable);
    
    // 피드에 관련된 이미지들을 찾기 위한 메서드
    @Query("SELECT f FROM FileModel f WHERE f.entityType = 'feed' AND f.entityIdx = :feedIdx")
    List<FileModel> findFilesByFeedIdx(@Param("feedIdx") Integer feedIdx);
    
    // 피드의 좋아요 업데이트
    @Modifying
    @Transactional
    @Query("UPDATE FeedModel f SET f.feedLikes = f.feedLikes + :delta WHERE f.feedIdx = :feedIdx")
    void updateLikes(@Param("feedIdx") int feedIdx, @Param("delta") int delta);
    
}