package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.izg.back_end.model.MealModel;

public interface MealRepository extends JpaRepository<MealModel, Integer>{
	
	// 가족 ID에 해당하는 모든 레시피 목록을 반환
	@Query("SELECT m FROM MealModel m WHERE m.familyIdx = :familyIdx ORDER BY " +
	           "m.postedAt DESC, " + // 먼저 날짜로 정렬
	           "CASE m.mealType " +
	           "WHEN '아침' THEN 1 " +
	           "WHEN '점심' THEN 2 " +
	           "WHEN '간식' THEN 3 " +
	           "WHEN '저녁' THEN 4 " +
	           "WHEN '야식' THEN 5 " +
	           "ELSE 6 END")
    List<MealModel> findByFamilyIdxOrderByMealDateAndMealType(@Param("familyIdx") int familyIdx);
}
