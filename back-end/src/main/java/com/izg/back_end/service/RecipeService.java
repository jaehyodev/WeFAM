package com.izg.back_end.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.RecipeDto;
import com.izg.back_end.model.RecipeModel;
import com.izg.back_end.repository.RecipeRepository;

@Service
public class RecipeService {
	
	@Autowired
	private RecipeRepository recipeRepository;
	
	public RecipeDto getRecipe(int recipeIdx) {
	    Optional<RecipeModel> optionalRecipe = recipeRepository.findById(recipeIdx);
	    
	    return optionalRecipe.map(recipeModel -> new RecipeDto(
	        recipeModel.getRecipeIdx(),
	        recipeModel.getRecipeCategory(),
	        recipeModel.getRecipeImage(),
	        recipeModel.getRecipeName(),
	        recipeModel.getRecipeDescription(),
	        recipeModel.getRecipeTime(),
	        recipeModel.getRecipePortion(),
	        recipeModel.getRecipeIngredient(),
	        recipeModel.getRecipeCook()
	    )).orElse(null); // 비어있을 경우 null 반환
	}
}
