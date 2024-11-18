package com.izg.back_end.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.FeedCommentDto;
import com.izg.back_end.model.FeedCommentModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FeedCommentRepository;
import com.izg.back_end.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class FeedCommentService {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private FeedCommentRepository feedCommentRepository;
	
	@Transactional
	public FeedCommentModel addFeedComment(FeedCommentModel fcm) {
		return feedCommentRepository.save(fcm);
	}
	
	@Transactional
	public List<FeedCommentDto> getCommentsByFeedIdx(int feedIdx) {
        // 데이터베이스에서 댓글 조회
        List<FeedCommentModel> comments = feedCommentRepository.findByFeedIdx(feedIdx);

        // FeedComment를 FeedCommentDto로 변환
        return comments.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    // FeedComment를 FeedCommentDto로 변환
    private FeedCommentDto convertToDto(FeedCommentModel comment) {
        UserModel user = userRepository.findById(comment.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("댓글 작성자를 찾을 수 없습니다."));
        
        return new FeedCommentDto(
            comment.getCmtIdx(),
            comment.getFeedIdx(),
            user.getProfileImg(),
            comment.getUserId(),
            user.getNick(),
            comment.getCmtContent(),
            comment.getPostedAt()
        );
    }
    
    // 댓글 ID로 댓글 조회
    public FeedCommentDto getComment(int cmtIdx) {
    	FeedCommentModel fcm = feedCommentRepository.findByCmtIdx(cmtIdx);
    	
    	if (fcm != null) {
    		// DTO 변환
    		return convertToDto(fcm);
    	} else {
    		// 댓글이 존재하지 않는 경우 처리
    		return null;
    	}
    }
    
    // 댓글 ID로 댓글 삭제
    @Transactional
	public void deleteComment(int cmtIdx) {
		feedCommentRepository.deleteById(cmtIdx);
	}
    
    @Transactional
    public int countComments(int feedIdx) {
    	return feedCommentRepository.countByFeedIdx(feedIdx);
    }
}
