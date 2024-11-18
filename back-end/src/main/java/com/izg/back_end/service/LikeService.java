package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.LikeDto;
import com.izg.back_end.model.LikeModel;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.repository.FeedRepository;
import com.izg.back_end.repository.LikeRepository;

import jakarta.transaction.Transactional;

@Service
public class LikeService {
	
	@Autowired
	private LikeRepository likeRepository;
	
	@Autowired
	private FeedRepository feedRepository;
	
	// 좋아요가 있는 지 확인
	public boolean checkLike(LikeDto likeDto) {
		LikeModel existingLike
			= likeRepository.findByUserIdAndFeedIdx(likeDto.getUserId(), likeDto.getFeedIdx());	
		return (existingLike != null);	
	}
	
	@Transactional
	public boolean toggleLike(LikeDto likeDto) {
		// 좋아요가 있는 지 확인
		LikeModel existingLike
			= likeRepository.findByUserIdAndFeedIdx(likeDto.getUserId(),likeDto.getFeedIdx());
		
 		if (existingLike != null) {
 			// 좋아요가 있는 경우: 제거
			likeRepository.deleteByUserIdAndFeedIdx(likeDto.getUserId(), likeDto.getFeedIdx());
			// 피드 테이블의 좋아요 -1
			updateFeedLikes(likeDto.getFeedIdx(), -1);
			return false;
		} else {
			// 좋아요가 없는 경우: 추가
			LikeModel likeModel = new LikeModel();
			likeModel.setUserId(likeDto.getUserId());
			likeModel.setFeedIdx(likeDto.getFeedIdx());
			likeRepository.save(likeModel);
			// 피드 테이블의 좋아요 +1
			updateFeedLikes(likeDto.getFeedIdx(), 1);
			return true;
		}
	}
	
	@Transactional
	private void updateFeedLikes(Integer feedIdx, int delta) {
        FeedModel feed = feedRepository.findById(feedIdx)
                .orElseThrow(() -> new RuntimeException("피드를 찾을 수 없습니다."));

        int newLikesCount = feed.getFeedLikes() + delta;
        feed.setFeedLikes(newLikesCount);

        feedRepository.save(feed);
    }
}
