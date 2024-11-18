package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.izg.back_end.model.FeedCommentModel;

public interface FeedCommentRepository extends JpaRepository<FeedCommentModel, Integer> {
	// feed ID로 댓글 조회
    List<FeedCommentModel> findByFeedIdx(int feedIdx);
    
    // 댓글 ID로 댓글 조회
    FeedCommentModel findByCmtIdx(int cmtIdx);
    
    // @Query("SELECT COUNT(c) FROM FeedComment C WHERE c.feedIdx = :feedIdx")
    int countByFeedIdx(int feedIdx);
}