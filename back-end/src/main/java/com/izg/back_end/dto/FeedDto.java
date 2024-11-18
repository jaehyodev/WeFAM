package com.izg.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Transient;
import lombok.Data;

@Data
public class FeedDto {
    private int feedIdx;
    private int familyIdx;
    private String userId;
    private LocalDateTime postedAt;
    private String feedLocation;
    private String feedType;
    private String feedContent;
    private int feedLikes;
    private List<RouletteDto> roulettes;
    private List<PollDto> polls;
}