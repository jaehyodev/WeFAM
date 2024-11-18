package com.izg.back_end.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.izg.back_end.dto.FeedContentDto;
import com.izg.back_end.dto.FeedDetailDto;
import com.izg.back_end.dto.FeedDto;
import com.izg.back_end.dto.FeedWithImagesDto;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FeedRepository;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.UserRepository;

@Service
public class FeedService {
	
	private final FeedRepository feedRepository;
	private final FileRepository fileRepository;
	private final UserRepository userRepository;

	public FeedService(FeedRepository feedRepository, FileRepository fileRepository, UserRepository userRepository) {
		this.feedRepository = feedRepository;
		this.fileRepository = fileRepository;
		this.userRepository = userRepository;
	}

	// 피드 추가 (이미지 없는 경우)
	@Transactional
	public FeedModel addFeed(FeedDto feedDto) {
		// 피드 정보 저장
	    FeedModel feedModel = new FeedModel();   
	    feedModel.setFamilyIdx(feedDto.getFamilyIdx());
	    feedModel.setUserId(feedDto.getUserId());
	    feedModel.setFeedContent(feedDto.getFeedContent());
	    feedModel.setFeedLocation(feedDto.getFeedLocation());
		
		return feedRepository.save(feedModel);
	}
	
	// 피드 추가 (이미지 있는 경우)
	@Transactional
	public FeedModel addFeedWithImages(FeedWithImagesDto feedWithImagesDto) throws IOException {
		// 1. 피드 정보 저장
		FeedModel feedModel = new FeedModel();
		feedModel.setFamilyIdx(feedWithImagesDto.getFamilyIdx());
		feedModel.setUserId(feedWithImagesDto.getUserId());
		feedModel.setFeedContent(feedWithImagesDto.getFeedContent());
		feedModel.setFeedLocation(feedWithImagesDto.getFeedLocation());

		// 2. 파일 정보 저장
		for (int i = 0; i < feedWithImagesDto.getImages().size(); i++) {
			MultipartFile file = feedWithImagesDto.getImages().get(i);

			String fileName = feedWithImagesDto.getFileNames().get(i);
			String fileExtension = feedWithImagesDto.getFileExtensions().get(i);
			Long fileSize = feedWithImagesDto.getFileSizes().get(i);

			FileModel fileModel = new FileModel();
			fileModel.setFamilyIdx(feedWithImagesDto.getFamilyIdx());
			fileModel.setUserId(feedWithImagesDto.getUserId());
			fileModel.setEntityType(feedWithImagesDto.getEntityType());
			fileModel.setEntityIdx(feedWithImagesDto.getEntityIdx());
			fileModel.setFileRname(fileName);
			fileModel.setFileUname(UUID.randomUUID().toString() + "_" + fileName);
			fileModel.setFileSize(fileSize);
			fileModel.setFileExtension(fileExtension);
			fileModel.setFileData(file.getBytes());

			fileRepository.save(fileModel);
		}

		return feedRepository.save(feedModel);
	}
	
	// 피드의 파일(이미지) 조회
	@Transactional(readOnly = true)
	public List<FileModel> getFilesByFeedIdx(Integer feedIdx) throws IOException {
		return feedRepository.findFilesByFeedIdx(feedIdx);
	}

	// 피드 조회
	@Transactional(readOnly = true)
	public Page<FeedModel> getFeedsByFamilyIdx(Integer familyIdx, Pageable pageable) {
		return feedRepository.findAllByFamilyIdx(familyIdx, pageable);
	}
	
	// 피드 상세 조회
	@Transactional(readOnly = true)
	public FeedDetailDto getFeedDetail(int feedIdx) {
		FeedModel feed = feedRepository.findById(feedIdx)
				.orElseThrow(() -> new IllegalArgumentException("피드를 찾을 수 없습니다."));

		UserModel user = userRepository.findById(feed.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("피드 작성자를 찾을 수 없습니다."));

		// FeedModel과 User 엔티티에서 DTO로 변환
		FeedDetailDto feedDetailDto = new FeedDetailDto();
		feedDetailDto.setFeedIdx(feed.getFeedIdx());
		feedDetailDto.setProfileImg(user.getProfileImg());
		feedDetailDto.setUserId(user.getId());
		feedDetailDto.setNick(user.getNick());
		feedDetailDto.setFeedContent(feed.getFeedContent());
		feedDetailDto.setFeedLocation(feed.getFeedLocation());
		feedDetailDto.setPostedAt(feed.getPostedAt());

		return feedDetailDto;
	}
	
	// 피드 수정
	@Transactional
	public void updateFeed(int feedIdx, FeedContentDto feedContentDto) {
		FeedModel updatedFeedModel = feedRepository.findById(feedIdx).orElseThrow();
		updatedFeedModel.setFeedContent(feedContentDto.getFeedContent());
		// 더티 체킹 : save를 호출하지 않아도 트랜잭션이 끝날 때 자동으로 업데이트.
		// 그러나 명시적으로 save를 호출하는 것을 권장하는 경우도 있음.
		feedRepository.save(updatedFeedModel);
	}

	// 피드 삭제
	@Transactional
	public void deleteFeed(int feedIdx) {
		// 먼저 파일을 삭제
		fileRepository.deleteByEntityTypeAndEntityIdx("feed", feedIdx);

		// 이후 피드를 삭제
		feedRepository.deleteById(feedIdx);
	}
}