package com.izg.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {

    // 레시피의 고유 ID
    private int recipeIdx;

    // 레시피 카테고리
    private String recipeCategory;

    // 레시피 이미지 URL 또는 경로
    private String recipeImage;

    // 레시피 이름
    private String recipeName;

    // 레시피 설명
    private String recipeDescription;

    // 조리 시간
    private int recipeTime;

    // 인분
    private int recipePortion;

    // 레시피 재료
    private String recipeIngredient;

    // 레시피 요리 방법
    private String recipeCook;
}
