package com.izg.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String senderId;   // 보낸 사람 ID
    private String senderNick;  // 보낸 사람 닉네임
    private String receiverId; // 받는 사람 ID
    private String message;    // 쪽지 내용
    private String time;       // 쪽지 전송 시간
    private String type;       // 알림 유형 (쪽지 등)
    private String profileImg;  // 프로필 이미지 URL
}
