package com.izg.back_end.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FeedDetailDto {
    private Integer feedIdx;
    private String profileImg;
    private String userId;
    private String nick;
    private String feedContent;
    private String feedLocation;
    private LocalDateTime postedAt;
}