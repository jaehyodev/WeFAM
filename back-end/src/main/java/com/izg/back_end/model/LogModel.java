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
@Table(name = "log")
@Data
public class LogModel {

    // 첨부파일 변수 없음. 추가할 것!
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_idx")
    @JsonProperty("logIdx")
    private int logIdx = 0; // 기본값 0
    
    @Column(name = "user_id")
    @JsonProperty("id")
    private String id = ""; // 기본값 빈 문자열
    
    @Column(name = "user_token")
    @JsonProperty("userToken")
    private String userToken = ""; // 기본값 빈 문자열
    
    @Column(name = "expired_at")
    @JsonProperty("expiredAt")
    private LocalDateTime expiredAt = LocalDateTime.now().plusDays(1); // 기본값 현재 날짜와 시간 + 1일

    @Column(name = "log_type")
    @JsonProperty("logType")
    private String logType = ""; // 기본값 빈 문자열

    @Column(name = "log_time")
    @JsonProperty("logTime")
    private LocalDateTime logTime = LocalDateTime.now(); // 기본값 현재 날짜와 시간

    @Column(name = "log_status")
    @JsonProperty("logStatus")
    private String logStatus = ""; // 기본값 빈 문자열

    

    

    
}
