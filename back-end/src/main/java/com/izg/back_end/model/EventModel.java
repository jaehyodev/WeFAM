package com.izg.back_end.model;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "event")
@Data
public class EventModel {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
   @Column(name = "event_idx")
   @JsonProperty("eventIdx")
   private int eventIdx;

   @Column(name = "family_idx")
   @JsonProperty("familyIdx")
   private int familyIdx;

   @Column(name = "user_id")
   @JsonProperty("userId")
   private String userId; // 기본값 빈 문자열

   @Column(name = "event_title")
   @JsonProperty("eventTitle")
   private String eventTitle = ""; // 기본값 빈 문자열

   @Column(name = "event_st_dt")
   @JsonProperty("eventStDt")
   private LocalDate eventStDt = LocalDate.now(); // 기본값 현재 날짜

   @Column(name = "event_st_tm")
   @JsonProperty("eventStTm")
   private LocalTime eventStTm = LocalTime.now(); // 기본값 현재 시간

   @Column(name = "event_ed_dt")
   @JsonProperty("eventEdDt")
   private LocalDate eventEdDt = LocalDate.now(); // 기본값 현재 날짜

   @Column(name = "event_ed_tm")
   @JsonProperty("eventEdTm")
   private LocalTime eventEdTm = LocalTime.now(); // 기본값 현재 시간

   @Column(name = "event_color")
   @JsonProperty("eventColor")
   private String eventColor; // 기본값 빈 문자열

   @Column(name = "event_content")
   @JsonProperty("eventContent")
   private String eventContent = ""; // 기본값 빈 문자열

   @Column(name = "is_all_day")
   @JsonProperty("isAllDay")
   private int isAllDay = 0;

   @Column(name = "event_location")
   @JsonProperty("eventLocation")
   private String eventLocation = ""; // 기본값 빈 문자열

   @Column(name = "latitude")
   @JsonProperty("latitude")
   private BigDecimal latitude = BigDecimal.ZERO; // 기본값 0

   @Column(name = "longitude")
   @JsonProperty("longitude")
   private BigDecimal longitude = BigDecimal.ZERO; // 기본값 0
}
