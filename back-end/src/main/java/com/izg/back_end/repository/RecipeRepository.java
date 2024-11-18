package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.RecipeModel;

public interface RecipeRepository extends JpaRepository<RecipeModel, Integer>{
	
}
