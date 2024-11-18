package com.izg.back_end.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserDto {
    private String id;
    private String name;
    private String nick;
    private LocalDate birth;
    private String profileImg;
    private LocalDateTime joinedAt;
    private String loginSource;
    private String accessToken;
}