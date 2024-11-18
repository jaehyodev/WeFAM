package com.izg.back_end.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.MealDto;
import com.izg.back_end.model.MealModel;
import com.izg.back_end.model.RecipeModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.MealRepository;
import com.izg.back_end.repository.RecipeRepository;
import com.izg.back_end.repository.UserRepository;

@Service
public class MealService {

	@Autowired
	public MealRepository mealRepository;

	@Autowired
	public RecipeRepository recipeRepository;

	@Autowired
	public UserRepository userRepository;

	// 가족 식사 Meal 추가
	public MealDto addMeal(int familyIdx, MealDto mealDto) {
		// MealDto -> RecipeModel 변환
		Optional<RecipeModel> optionalRecipe = recipeRepository.findById(mealDto.getRecipeIdx());

		// Recipe가 존재하지 않는 경우 처리
		if (optionalRecipe.isEmpty()) {
			throw new RuntimeException("Recipe not found for ID: " + mealDto.getRecipeIdx());
		}

		// RecipeModel을 가져옴
		RecipeModel recipe = optionalRecipe.get();

		// RecipeModel -> MealModel 변환
		MealModel meal = new MealModel();
		meal.setFamilyIdx(familyIdx);
		meal.setUserId(mealDto.getUserId());
		meal.setPostedAt(LocalDateTime.now());
		meal.setMealDate(mealDto.getMealDate());
		meal.setMealType(mealDto.getMealType());
		meal.setMealName(recipe.getRecipeName());
		meal.setMealThumbnail(recipe.getRecipeImage());
		meal.setMealContent(mealDto.getMealContent());
		meal.setRecipeIdx(mealDto.getRecipeIdx());

		// JPA save 메서드로 저장
		MealModel savedMeal = mealRepository.save(meal);

		// MealModel을 MealDto로 변환
		MealDto savedMealDto = new MealDto();
		savedMealDto.setMealDate(savedMeal.getMealDate());
		savedMealDto.setMealType(savedMeal.getMealType());
		savedMealDto.setMealContent(savedMeal.getMealContent());
		savedMealDto.setRecipeIdx(savedMeal.getRecipeIdx());

		return savedMealDto;
	}

	// 가족 ID에 해당하는 모든 가족 식사 목록을 반환
	public List<MealDto> getAllMeals(int familyIdx) {
		List<MealModel> meals = mealRepository.findByFamilyIdxOrderByMealDateAndMealType(familyIdx);

		List<MealDto> mealDtos = new ArrayList<MealDto>();

		for (MealModel meal : meals) {
			MealDto mealDto = new MealDto();
			mealDto.setMealIdx(meal.getMealIdx());
			mealDto.setUserId(meal.getUserId());

			// 아이디를 통해 닉네임 가져오기
			Optional<UserModel> optionalUser = userRepository.findById(meal.getUserId());
			// user가 존재하지 않는 경우 처리
			if (optionalUser.isEmpty()) {
				throw new RuntimeException("User not found for ID: " + mealDto.getMealIdx());
			}
			// UserModel을 가져옴
			UserModel user = optionalUser.get();

			mealDto.setUserNick(user.getNick());
			mealDto.setProfileImg(user.getProfileImg());
			mealDto.setPostedAt(meal.getPostedAt());
			mealDto.setMealDate(meal.getMealDate());
			mealDto.setMealType(meal.getMealType());
			mealDto.setMealName(meal.getMealName());
			mealDto.setMealThumbnail(meal.getMealThumbnail());
			mealDto.setMealContent(meal.getMealContent());
			mealDto.setRecipeIdx(meal.getRecipeIdx());

			mealDtos.add(mealDto);
		}

		return mealDtos;
	}

	// 특정 가족 식사 조회
	public MealDto getMeal(int mealIdx) {
		Optional<MealModel> optionalMeal = mealRepository.findById(mealIdx);

		if (optionalMeal.isEmpty()) {
			throw new RuntimeException("Meal not found for ID: " + mealIdx);
		}
		// MealModel을 가져옴
		MealModel meal = optionalMeal.get();

		MealDto mealDto = new MealDto();
		mealDto.setMealIdx(meal.getMealIdx());
		mealDto.setMealDate(meal.getMealDate());
		mealDto.setMealType(meal.getMealType());
		mealDto.setMealContent(meal.getMealContent());
		mealDto.setRecipeIdx(meal.getRecipeIdx());

		return mealDto;
	}

	// MealDto를 사용하여 식사 정보를 업데이트하는 메서드
	public MealDto updateMeal(int mealIdx, MealDto mealDto) {
		
		// MealDto -> RecipeModel 변환
		RecipeModel recipe = recipeRepository.findById(mealDto.getRecipeIdx())
				.orElseThrow(() -> new RuntimeException("Meal not found for ID: " + mealIdx));

		// 식사 모델을 식별자로 조회
		MealModel meal = mealRepository.findById(mealIdx)
				.orElseThrow(() -> new RuntimeException("Meal not found for ID: " + mealIdx));

		// DTO의 값을 식사 모델에 설정
		meal.setMealName(recipe.getRecipeName());
		meal.setMealThumbnail(recipe.getRecipeImage());
		meal.setMealDate(mealDto.getMealDate());
		meal.setMealType(mealDto.getMealType());
		meal.setMealContent(mealDto.getMealContent());
		meal.setRecipeIdx(mealDto.getRecipeIdx());

		// 업데이트된 식사 모델을 저장
		MealModel updatedMeal = mealRepository.save(meal);

		// 업데이트된 식사 모델을 DTO로 변환하여 반환
		MealDto updatedMealDto = new MealDto();
		updatedMealDto.setMealIdx(updatedMeal.getMealIdx());
		updatedMealDto.setMealName(updatedMeal.getMealName());
		updatedMealDto.setMealThumbnail(updatedMeal.getMealThumbnail());
		updatedMealDto.setMealDate(updatedMeal.getMealDate());
		updatedMealDto.setMealType(updatedMeal.getMealType());
		updatedMealDto.setMealContent(updatedMeal.getMealContent());
		updatedMealDto.setRecipeIdx(updatedMeal.getRecipeIdx());

		return updatedMealDto;
	}

	// 특정 가족 식사 삭제
	public void deleteMeal(int mealIdx) {
		Optional<MealModel> optionalMeal = mealRepository.findById(mealIdx);

		if (optionalMeal.isEmpty()) {
			throw new RuntimeException("Meal not found for ID: " + mealIdx);
		}
		// MealModel을 가져옴
		MealModel meal = optionalMeal.get();
		mealRepository.delete(meal);
	}

}
