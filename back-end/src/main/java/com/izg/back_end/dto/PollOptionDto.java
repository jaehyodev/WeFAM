package com.izg.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollOptionDto {
    private int pollOptionIdx;
    private String pollOptionContent;
}