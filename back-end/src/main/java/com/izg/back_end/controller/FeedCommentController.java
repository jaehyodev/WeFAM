package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.FeedCommentDto;
import com.izg.back_end.model.FeedCommentModel;
import com.izg.back_end.service.FeedCommentService;

@RestController
@CrossOrigin
public class FeedCommentController {
	
	@Autowired
	private FeedCommentService feedCommentService;
	
	@PostMapping("/add-feed-comment")
    public FeedCommentModel addFeedComment(@RequestBody FeedCommentDto feedCommentDto) {
        System.out.println("Received feed comment DTO : " + feedCommentDto);
        
        // DTO를 엔티티로 변환
        FeedCommentModel feedCommentModel = new FeedCommentModel();
        feedCommentModel.setFeedIdx(feedCommentDto.getFeedIdx());
        feedCommentModel.setUserId(feedCommentDto.getUserId());
        feedCommentModel.setCmtContent(feedCommentDto.getCmtContent());
        feedCommentModel.setPostedAt(feedCommentDto.getPostedAt());
        
        // 서비스 호출
        FeedCommentModel addedFeedComment = feedCommentService.addFeedComment(feedCommentModel);
        return addedFeedComment;
    }
	
	@GetMapping("/get-comments/{feedIdx}")
    public List<FeedCommentDto> getComments(@PathVariable("feedIdx") Integer feedIdx) {
		System.out.println("Received feedIdx to show comments : " + feedIdx );
		return feedCommentService.getCommentsByFeedIdx(feedIdx);
    }
	
	@GetMapping("/get-comment/{cmtIdx}")
	public FeedCommentDto getComment(@PathVariable("cmtIdx") int cmtIdx) {
		System.out.println("Received cmtIdx : " + cmtIdx);
		return feedCommentService.getComment(cmtIdx);
	}
	
	@DeleteMapping("/delete-comment/{cmtIdx}")
	public void deleteComment(@PathVariable("cmtIdx") int cmtIdx) {
		System.out.println("Received cmtIdx to delete comment : " + cmtIdx);
		feedCommentService.deleteComment(cmtIdx);
	}
	
	@GetMapping("/count-comments/{feedIdx}")
	public int getMethodName(@PathVariable("feedIdx") int feedIdx) {
		System.out.println("Received feedIdx to count comments");
		return feedCommentService.countComments(feedIdx);
	}
	
	
}
