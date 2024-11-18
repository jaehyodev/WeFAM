package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.MealDto;
import com.izg.back_end.dto.RecipeDto;
import com.izg.back_end.service.MealService;
import com.izg.back_end.service.RecipeService;

@CrossOrigin
@RestController
public class MealController {

	@Autowired
	private MealService mealService;
	
	@Autowired
	private RecipeService recipeService;
	

	// 가족 식사 Meal 추가
	@PostMapping("/families/{familyIdx}/meals")
	public ResponseEntity<MealDto> addRecipe(
	    @PathVariable("familyIdx") int familyIdx,
	    @RequestBody MealDto mealDto
	) {
	    if (familyIdx <= 0) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    MealDto addedMeal = mealService.addMeal(familyIdx, mealDto);

	    if (addedMeal == null) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }

	    return new ResponseEntity<>(addedMeal, HttpStatus.CREATED);
	}

	// 특정 가족(familyIdx)에 속한 모든 식사 목록을 반환하는 메서드
	@GetMapping("/families/{familyIdx}/meals")
	public ResponseEntity<List<MealDto>> getAllMeals(@PathVariable("familyIdx") int familyIdx) {

		if (familyIdx <= 0) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		List<MealDto> meals = mealService.getAllMeals(familyIdx);

		if (meals.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

		return new ResponseEntity<>(meals, HttpStatus.OK);
	}

	// 특정 레시피 조회
	@GetMapping("/recipes/{recipeIdx}")
	public ResponseEntity<RecipeDto> getRecipe(@PathVariable("recipeIdx") int recipeIdx) {

	    // 잘못된 레시피 ID 요청에 대한 처리
	    if (recipeIdx <= 0) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    // 서비스에서 레시피 조회
	    RecipeDto recipe = recipeService.getRecipe(recipeIdx);

	    // 레시피가 없는 경우 처리
	    if (recipe == null) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }

	    // 레시피가 존재하면 OK와 함께 반환
	    return new ResponseEntity<>(recipe, HttpStatus.OK);
	}
	
	// 특정 식사 조회
	@GetMapping("/meals/{mealIdx}")
    public ResponseEntity<MealDto> getMeal(@PathVariable("mealIdx") int mealIdx) {
		
		// 잘못된 식사 ID 요청에 대한 처리
	    if (mealIdx <= 0) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    // 서비스에서 레시피 조회
	    MealDto meal = mealService.getMeal(mealIdx);

	    // 레시피가 없는 경우 처리
	    if (meal == null) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }

	    // 레시피가 존재하면 OK와 함께 반환
	    return new ResponseEntity<>(meal, HttpStatus.OK);
    }
	
	// 특정 식사 수정
	@PutMapping("/meals/{mealIdx}")
    public ResponseEntity<MealDto> updateMeal(
        @PathVariable("mealIdx") int mealIdx,
        @RequestBody MealDto mealDto
    ) {
        try {
            MealDto updatedMeal = mealService.updateMeal(mealIdx, mealDto);
            return ResponseEntity.ok(updatedMeal);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null); // 적절한 에러 처리
        }
    }
	
    // 특정 식사 삭제
    @DeleteMapping("/meals/{mealIdx}")
    public ResponseEntity<Void> deleteMeal(@PathVariable("mealIdx") int mealIdx) {
        mealService.deleteMeal(mealIdx);
        return ResponseEntity.noContent().build();
    }
}
