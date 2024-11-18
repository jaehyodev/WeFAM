package com.izg.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouletteDto {
	private int rouletteIdx;
    private int feedIdx;
    private String userId;
    private String rouletteTitle;
    private double totalAngle;
    private int selectedOptionNum;
    private LocalDateTime createdAt;
    private List<RouletteOptionDto> rouletteOptions;
}
