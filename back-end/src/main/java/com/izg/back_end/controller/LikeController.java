package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.LikeDto;
import com.izg.back_end.service.LikeService;

@RestController
public class LikeController {

		@Autowired
		private LikeService likeService;
		
		@GetMapping("/check-like")
		public boolean checkLike(@RequestParam(name = "userId") String userId, @RequestParam(name = "feedIdx") int feedIdx) {
			LikeDto likeDto = new LikeDto(userId, feedIdx);
			return likeService.checkLike(likeDto);
		}
		
		@PostMapping("/toggle-like")
		public boolean toggleLike(@RequestBody LikeDto likeDto) {
			System.out.println("좋아요 누른 피드 번호 : " + likeDto.getFeedIdx());
			System.out.println("좋아요 누른 내 아이디 : " + likeDto.getUserId());
			return likeService.toggleLike(likeDto);
		}
		
}
