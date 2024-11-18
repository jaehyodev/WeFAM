package com.izg.back_end.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "joining")
@Data
public class JoiningModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "join_idx")
    @JsonProperty("joinIdx")
    private int joinIdx = 0; // 기본값 0

    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId = ""; // 기본값 빈 문자열

    @Column(name = "family_idx")
    @JsonProperty("familyIdx")
    private int familyIdx = 0; // 기본값 0

    @Column(name = "joined_at")
    @JsonProperty("joinedAt")
    private LocalDateTime joinedAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간
}
