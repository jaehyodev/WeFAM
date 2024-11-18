package com.izg.back_end.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.NotificationDto;

@RestController
public class MessageController {

    // 답장 API
    @PostMapping("/wefam/reply-message")
    public ResponseEntity<String> replyMessage(@RequestBody NotificationDto notification) {
        // 답장 처리 로직
        // 예: 데이터베이스에 답장 저장
        System.out.println("Reply from " + notification.getSenderId() + " to " + notification.getReceiverId());
        return ResponseEntity.ok("Reply sent successfully");
    }

    // 삭제 API
    @DeleteMapping("/wefam/delete-message/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable String id) {
        // 삭제 처리 로직
        // 예: 데이터베이스에서 해당 ID의 메시지 삭제
        System.out.println("Message with ID " + id + " has been deleted");
        return ResponseEntity.ok("Message deleted successfully");
    }
}
