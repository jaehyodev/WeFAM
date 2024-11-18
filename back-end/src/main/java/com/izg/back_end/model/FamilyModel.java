package com.izg.back_end.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "family")
@Data
public class FamilyModel {
    @Id
    @Column(name = "family_idx")
    @JsonProperty("familyIdx")
    private int familyIdx = 0; // 기본값 0

    @Column(name = "family_nick")
    @JsonProperty("familyNick")
    private String familyNick = ""; // 기본값 빈 문자열

    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId = ""; // 기본값 빈 문자열

    @Column(name = "created_at")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간
    
    @Column(name = "family_motto")
    @JsonProperty("familyMotto")
    private String familyMotto = ""; // 기본값 빈 문자열
}
