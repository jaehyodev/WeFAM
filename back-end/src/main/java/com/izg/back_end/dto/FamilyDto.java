package com.izg.back_end.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FamilyDto {
    private int familyIdx;
    private String familyNick;
    private String id;
    private LocalDateTime createdAt;
    private String familyMotto;
}
