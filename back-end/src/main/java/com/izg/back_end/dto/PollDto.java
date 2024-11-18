package com.izg.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollDto {
	private int pollIdx;
    private int feedIdx;
    private String userId;
    private String pollTitle;
    private LocalDateTime createdAt;
    private List<PollOptionDto> pollOptions;
}
