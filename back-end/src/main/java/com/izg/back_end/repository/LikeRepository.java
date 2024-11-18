package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.LikeModel;

@Repository
public interface LikeRepository extends JpaRepository<LikeModel, Integer> {
	// 좋아요 조회
	LikeModel findByUserIdAndFeedIdx(String userId, int feedIdx);

	// 좋아요 취소
	void deleteByUserIdAndFeedIdx(String userId, int feedIdx);
}
