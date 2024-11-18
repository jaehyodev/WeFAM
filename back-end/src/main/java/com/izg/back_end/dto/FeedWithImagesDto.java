package com.izg.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class FeedWithImagesDto {
    private int familyIdx;
    private String userId;
    private String entityType;
    private int entityIdx;
    private String feedContent;
    private String feedLocation;
    private List<MultipartFile> images;
    private List<String> fileNames;
    private List<String> fileExtensions;
    private List<Long> fileSizes;
    private String fileData;
    // 추가된 필드
    private List<PollDto> polls;
    private List<RouletteDto> roulettes;
}
