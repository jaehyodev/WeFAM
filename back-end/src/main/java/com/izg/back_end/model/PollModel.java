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
@Table(name = "poll")
public class PollModel {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_idx")
	@JsonProperty("pollIdx")
    private int pollIdx;

    @Column(name = "feed_idx", nullable = false)
    @JsonProperty("feedIdx")
    private int feedIdx;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("userId")
    private String userId;

    @Column(name = "poll_title", nullable = false)
    @JsonProperty("pollTitle")
    private String pollTitle;

    @Column(name = "created_at", nullable = false)
    @JsonProperty("CreatedAt")
    private LocalDateTime createdAt;
}
