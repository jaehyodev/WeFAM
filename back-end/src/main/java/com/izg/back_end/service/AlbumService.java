package com.izg.back_end.service;

import com.izg.back_end.model.FileModel;
import com.izg.back_end.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AlbumService {

	@Autowired
	private FileRepository fileRepository;

	@Transactional
	public void addAlbumWithImages(int familyIdx, String userId, String entityType, int entityIdx,
			List<String> fileNames, List<String> fileExtensions, List<Long> fileSizes, List<MultipartFile> images)
			throws IOException {

		// 파일 정보 저장
		for (int i = 0; i < images.size(); i++) {
			MultipartFile file = images.get(i);

			String fileName = fileNames.get(i);
			String fileExtension = fileExtensions.get(i);
			Long fileSize = fileSizes.get(i);

			FileModel fileModel = new FileModel();
			fileModel.setFamilyIdx(familyIdx);
			fileModel.setUserId(userId);
			fileModel.setEntityType(entityType);
			fileModel.setEntityIdx(entityIdx);
			fileModel.setFileRname(fileName);
			fileModel.setFileUname(fileName + "_" + Instant.now().toEpochMilli());
			fileModel.setFileSize(fileSize);
			fileModel.setFileExtension(fileExtension);
			fileModel.setFileData(file.getBytes());
			fileModel.setUploadedAt(LocalDateTime.now());

			fileRepository.save(fileModel);
		}
	}
	
	// 이미지 불러오기
	 public List<FileModel> getImagesByFamilyIdx(int familyIdx) {
	        return fileRepository.findByFamilyIdx(familyIdx);
	 }	
	 
	 // 이미지 삭제하기
	 public void deleteImages(List<Integer> imageIds) {
	        for (Integer id : imageIds) {
	            fileRepository.deleteById(id);
	        }
	    }
	 
	 // 달력에서 사진 찾아오기
	  public List<FileModel> getImagesByDateRange(int familyIdx, String startDate, String endDate) {
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	        LocalDate start = LocalDate.parse(startDate, formatter);
	        LocalDate end = LocalDate.parse(endDate, formatter).plusDays(1); // endDate를 포함하기 위해 하루 더한다.

	        return fileRepository.findByFamilyIdxAndUploadedAtBetween(familyIdx, start.atStartOfDay(), end.atStartOfDay());
	    }
}
