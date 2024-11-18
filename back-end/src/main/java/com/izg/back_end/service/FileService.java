package com.izg.back_end.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.repository.FileRepository;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public List<FileModel> storeFiles(List<MultipartFile> files, int familyIdx, String userId, int entityIdx) throws IOException {
        for (MultipartFile file : files) {
            FileModel fileModel = new FileModel();
            fileModel.setFamilyIdx(familyIdx);
            fileModel.setUserId(userId);
            fileModel.setEntityType("event");
            fileModel.setEntityIdx(entityIdx);
            fileModel.setFileRname(file.getOriginalFilename());
            fileModel.setFileUname(generateUniqueFileName(file.getOriginalFilename())); // 고유 파일 이름 생성
            fileModel.setFileExtension(getFileExtension(file.getOriginalFilename()));
            fileModel.setFileSize(file.getSize());
            fileModel.setFileData(file.getBytes());

            fileRepository.save(fileModel);
        }

        return fileRepository.findByEntityIdx(entityIdx);
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private String generateUniqueFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

    // 특정 familyIdx에 해당하는 파일들을 가져오는 메서드
    public List<FileModel> getFilesByFamilyIdx(int familyIdx) {
        return fileRepository.findByFamilyIdx(familyIdx);
    }
    
    // 파일 삭제 메서드
    public void deleteFilesByIds(List<Integer> fileIdxList) {
        for (Integer fileIdx : fileIdxList) {
            fileRepository.deleteById(fileIdx);
        }
    }
}
