package com.izg.back_end.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "poll_user")
public class PollUserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_user_idx")
    private int pollUserIdx;

    @Column(name = "poll_idx", nullable = false)
    private int pollIdx;
    
    @Column(name = "selected_option_num", nullable = false)
    private int selectedOptionNum;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "voted_at", nullable = false)
    private LocalDateTime votedAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간;
}