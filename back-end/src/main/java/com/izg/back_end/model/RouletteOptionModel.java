package com.izg.back_end.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "roulette_option")
public class RouletteOptionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roulette_option_idx")
    private int rouletteOptionIdx;
    
    @Column(name = "roulette_idx")
    @JsonProperty("rouletteIdx")
    private int rouletteIdx;
    
    @Column(name = "roulette_option_num", nullable = false)
    private int rouletteOptionNum;

    @Column(name = "roulette_option_content", nullable = false)
    private String rouletteOptionContent;
}
