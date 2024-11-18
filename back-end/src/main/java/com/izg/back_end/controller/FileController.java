package com.izg.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.izg.back_end.service.FileService;
import com.izg.back_end.model.FileModel;
import java.io.IOException;
import java.util.List;

@RestController
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/event/image/upload") // 수정: ? 제거
    public ResponseEntity<List<FileModel>> uploadFiles(
        @RequestParam("files") List<MultipartFile> files,
        @RequestParam("familyIdx") int familyIdx,
        @RequestParam("userId") String userId,
        @RequestParam("entityIdx") int entityIdx
    ) {
        if (files.isEmpty()) {
            return ResponseEntity.badRequest().body(null); // 파일이 비어있을 경우 Bad Request 반환
        }

        try {
            List<FileModel> uploadedFiles = fileService.storeFiles(files, familyIdx, userId, entityIdx);
            return ResponseEntity.ok(uploadedFiles); // 저장된 파일 목록을 반환
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 상세한 오류 메시지와 함께 반환 가능
        }
    }
    
    // 특정 familyIdx에 대한 파일 리스트를 반환하는 엔드포인트
    @GetMapping("/event/files/family/{familyIdx}")
    public ResponseEntity<List<FileModel>> getFilesByFamilyIdx(@PathVariable("familyIdx") int familyIdx) {
        List<FileModel> files = fileService.getFilesByFamilyIdx(familyIdx);
        return ResponseEntity.ok(files);
    }
    
    // 여러 파일 삭제 엔드포인트
    @DeleteMapping("/event/files/delete/{fileIdx}")
    public ResponseEntity<String> deleteFiles(@PathVariable("fileIdx") List<Integer> fileIdxList) {
        try {
            fileService.deleteFilesByIds(fileIdxList);
            return ResponseEntity.ok("Files deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
