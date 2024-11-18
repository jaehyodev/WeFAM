package com.izg.back_end.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "meal")
public class MealModel {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_idx")
    private int mealIdx;
	
	@Column(name = "family_idx")
    private int familyIdx;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(name = "meal_date")
    private LocalDate mealDate;
    
    @Column(name = "meal_type")
    private String mealType;

    @Column(name = "meal_name")
    private String mealName;

    @Column(name = "meal_thumbnail")
    private String mealThumbnail;

    @Column(name = "meal_content")
    private String mealContent;
    
    @Column(name = "recipe_idx")
    private int recipeIdx;
}
