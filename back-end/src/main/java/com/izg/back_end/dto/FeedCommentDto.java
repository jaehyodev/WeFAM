package com.izg.back_end.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedCommentDto {

	@JsonProperty("cmtIdx")
	private Integer cmtIdx;
	
    @JsonProperty("feedIdx")
    private int feedIdx;
    
    @JsonProperty("profileImg")
    private String profileImg;
    
    @JsonProperty("userId")
    private String userId;
    
    @JsonProperty("nick")
    private String nick;
    
    @JsonProperty("cmtContent")
    private String cmtContent;
    
    @JsonProperty("postedAt")
    private LocalDateTime postedAt = LocalDateTime.now(); // Default to current date and time
}
