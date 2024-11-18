package com.izg.back_end.controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.izg.back_end.dto.FeedContentDto;
import com.izg.back_end.dto.FeedDetailDto;
import com.izg.back_end.dto.FeedDto;
import com.izg.back_end.dto.FeedWithImagesDto;
import com.izg.back_end.dto.ImageUploadDto;
import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.RouletteDto;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.repository.FeedRepository;
import com.izg.back_end.service.FeedService;
import com.izg.back_end.service.PollService;
import com.izg.back_end.service.RouletteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/feeds")
@CrossOrigin
public class FeedController {

	private final FeedService feedService;
	private final RouletteService rouletteService;
	private final PollService pollService;

	public FeedController(FeedService feedService, RouletteService rouletteService, PollService pollService) {
		this.feedService = feedService;
		this.rouletteService = rouletteService;
		this.pollService = pollService;
	}
	
	// 피드 추가 (이미지 없는 경우)
	@PostMapping
	public ResponseEntity<Void> addFeed(@RequestBody FeedDto feedDto) {
		// 피드 저장
		// FeedModel savedFeedModel = feedRepository.save(feed);
		FeedModel savedFeedModel = feedService.addFeed(feedDto);

		// 피드에 관련된 룰렛이 있는 경우, 룰렛 저장
		if (feedDto.getRoulettes() != null && !feedDto.getRoulettes().isEmpty()) {
			for (RouletteDto rouletteDto : feedDto.getRoulettes()) {
				// 룰렛 DTO의 feedIdx를 설정
				rouletteDto.setFeedIdx(savedFeedModel.getFeedIdx());
				rouletteDto.setUserId(feedDto.getUserId());

				// RouletteOptions를 변환할 필요는 없고
				// DTO의 rouletteOptions 필드에 이미 배열이 포함되어 있으므로
				// 그대로 사용하면 됩니다.

				System.out.println("룰렛 제목 : " + rouletteDto.getRouletteTitle());
				rouletteService.addRoulettes(rouletteDto);
			}
		}

		// 피드에 관련된 폴이 있는 경우, 폴 저장
		if (feedDto.getPolls() != null && !feedDto.getPolls().isEmpty()) {
			for (PollDto pollDto : feedDto.getPolls()) {
				// 폴 DTO의 feedIdx를 설정
				pollDto.setFeedIdx(savedFeedModel.getFeedIdx());
				pollDto.setUserId(feedDto.getUserId());

				// PollOptions를 변환할 필요는 없고
				// DTO의 pollOptions 필드에 이미 배열이 포함되어 있으므로
				// 그대로 사용하면 됩니다.

				System.out.println("투표 제목 : " + pollDto.getPollTitle());
				pollService.addPolls(pollDto);
			}
		}

		// 생성된 피드의 ID를 이용해 Location URI 생성
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{feedIdx}")
				.buildAndExpand(savedFeedModel.getFeedIdx()).toUri();

		// Location URI를 포함하여 CREATED 응답 반환
		return ResponseEntity.created(location).build();
	}

	// 피드 업로드 (이미지 있는 경우)
	@PostMapping("/images")
	public ResponseEntity<Void> addFeedWithImages(@ModelAttribute FeedWithImagesDto feedWithImagesDto,
			@RequestParam(name = "roulettesJson", required = false) String roulettesJson,
	        @RequestParam(name = "pollsJson", required = false) String pollsJson) throws IOException {
		// 피드 업로드 및 이미지 저장
	    FeedModel savedFeedModel = feedService.addFeedWithImages(feedWithImagesDto);
	    
	    // JSON 문자열을 DTO 리스트로 변환
        if (roulettesJson != null && !roulettesJson.isEmpty()) {
            List<RouletteDto> roulettes = new ObjectMapper().readValue(roulettesJson, new TypeReference<List<RouletteDto>>(){});
            for (RouletteDto rouletteDto : roulettes) {
                rouletteDto.setFeedIdx(savedFeedModel.getFeedIdx()); // 피드 ID 설정
                rouletteDto.setUserId(feedWithImagesDto.getUserId());

                System.out.println("룰렛 제목 : " + rouletteDto.getRouletteTitle());
                rouletteService.addRoulettes(rouletteDto);
            }
        }

        if (pollsJson != null && !pollsJson.isEmpty()) {
            List<PollDto> polls = new ObjectMapper().readValue(pollsJson, new TypeReference<List<PollDto>>(){});
            for (PollDto pollDto : polls) {
                pollDto.setFeedIdx(savedFeedModel.getFeedIdx()); // 피드 ID 설정
                pollDto.setUserId(feedWithImagesDto.getUserId());

                System.out.println("투표 제목 : " + pollDto.getPollTitle());
                pollService.addPolls(pollDto);
            }
        }

		// 생성된 피드의 ID를 이용해 Location URI 생성
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{feedIdx}")
				.buildAndExpand(savedFeedModel.getFeedIdx()).toUri();

		// Location URI를 포함하여 CREATED 응답 반환
		return ResponseEntity.created(location).build();
	}

	// 특정 가족 그룹에 대한 피드 조회
	@GetMapping("/families/{familyIdx}")
	public ResponseEntity<Page<FeedModel>> getFeedsByFamilyIdx(@PathVariable("familyIdx") Integer familyIdx,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size) {
		// PageRequest 객체 생성: 기본 내림차순 정렬
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("postedAt")));
		// 서비스 계층 호출
		return ResponseEntity.ok(feedService.getFeedsByFamilyIdx(familyIdx, pageable));
	}
	
	// 피드 상세내용 조회
	@GetMapping("/{feedIdx}")
	public FeedDetailDto getFeedDetail(@PathVariable("feedIdx") Integer feedIdx) {
		return feedService.getFeedDetail(feedIdx);
	}
	
	// 피드 수정
	@PatchMapping("/{feedIdx}")
	public void updateFeed(@PathVariable("feedIdx") Integer feedIdx, @RequestBody FeedContentDto feedContentDto) {
		System.out.println("To update received FeedIdx : " + feedIdx);
		feedService.updateFeed(feedIdx, feedContentDto);
	}

	// 피드 삭제
	@DeleteMapping("/{feedIdx}")
	public void deleteFeed(@PathVariable("feedIdx") Integer feedIdx) {
		System.out.println("To delete received FeedIdx : " + feedIdx);
		feedService.deleteFeed(feedIdx);
		// return "redirect:/";
	}
}