package com.izg.back_end.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealDto {
    private int mealIdx;
    private String userId;
    private String profileImg;
    private String userNick;
    private LocalDateTime postedAt;
    private LocalDate mealDate;
    private String mealType;
    private String mealName;
    private String mealThumbnail;
    private String mealContent;
    private int recipeIdx;
}
