package com.izg.back_end.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "roulette")
public class RouletteModel {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roulette_idx")
	@JsonProperty("rouletteIdx")
    private int rouletteIdx;
	
    @Column(name = "feed_idx", nullable = false)
    @JsonProperty("feedIdx")
    private int feedIdx;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("userId")
    private String userId;

    @Column(name = "roulette_title", nullable = false)
    @JsonProperty("rouletteTitle")
    private String rouletteTitle;
    
    @Column(name = "total_angle", nullable = false)
    @JsonProperty("totalAngle")
    private double totalAngle;
    
    @Column(name = "selected_option_num", nullable = false)
    @JsonProperty("selectedOptionNum")
    private int selectedOptionNum;

    @Column(name = "created_at", nullable = false)
    @JsonProperty("CreatedAt")
    private LocalDateTime createdAt;
}
