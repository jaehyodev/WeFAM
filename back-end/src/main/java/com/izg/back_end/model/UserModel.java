package com.izg.back_end.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "user")
@Data
public class UserModel {
    @Id
    @Column(name = "user_id" )
    @JsonProperty("id")
    private String id = ""; // 기본값 빈 문자열

    @Column(name = "user_name")
    @JsonProperty("name")
    private String name = ""; // 기본값 빈 문자열

    @Column(name = "user_nick")
    @JsonProperty("nick")
    private String nick = ""; // 기본값 빈 문자열

    @Column(name = "user_birthdate")
    @JsonProperty("birth")
    private LocalDate birth = LocalDate.now(); // 기본값을 현재 날짜로 설정

    @Column(name = "user_profile_img")
    @JsonProperty("profileImg")
    private String profileImg = ""; // 기본값 빈 문자열

    @Column(name = "joined_at")
    @JsonProperty("joinedAt")
    private LocalDateTime joinedAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간

    @Column(name = "login_source")
    @JsonProperty("loginSource")
    private String loginSource = ""; // 기본값 빈 문자열
    
    
}
