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
@Table(name = "feed_comment")
@Data
public class FeedCommentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cmt_idx")
    @JsonProperty("cmtIdx")
    private int cmtIdx = 0; // Default to 0

    @Column(name = "feed_idx")
    @JsonProperty("feedIdx")
    private int feedIdx = 0; // Default to 0
    
    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId = ""; // Default to empty string
    
    @Column(name = "cmt_content")
    @JsonProperty("cmtContent")
    private String cmtContent = ""; // Default to empty string
    
    @Column(name = "posted_at")
    @JsonProperty("postedAt")
    private LocalDateTime postedAt = LocalDateTime.now(); // Default to current date and time
       
//    @Column(name = "cmt_likes")
//    @JsonProperty("cmtLikes")
//    private int cmtLikes = 0; // Default to 0
}
