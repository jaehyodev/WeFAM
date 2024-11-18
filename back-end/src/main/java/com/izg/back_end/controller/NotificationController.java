package com.izg.back_end.controller;

import com.izg.back_end.dto.NotificationDto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
public class NotificationController {

    private final  Map<String, SseEmitter> clients = new HashMap<>();

    // SSE 연결 설정 (receiverId로 구독)
    @GetMapping("/notifications/{receiverId}")
    public SseEmitter subscribe(@PathVariable("receiverId") String receiverId) {
        SseEmitter emitter = new SseEmitter(60 * 1000L * 1000);
        clients.put(receiverId, emitter);  // receiverId를 String으로 저장

        System.out.println("구독된 수신자 ID: " + receiverId);
        System.out.println("구독자 리스트: " + clients.keySet());

        emitter.onCompletion(() -> clients.remove(receiverId));
        emitter.onTimeout(() -> {
            clients.remove(receiverId);
            emitter.complete();
        });
        emitter.onError((e) -> {
            clients.remove(receiverId);
            emitter.completeWithError(e);
        });

        return emitter;
    }
    
    // 온라인 현황
    @GetMapping("/online-users")
    public List<String> getOnlineUsers() {
        // 현재 구독된 사용자들의 ID를 리스트로 반환
        return new ArrayList<>(clients.keySet());
    }




    // 쪽지 전송 API
    @PostMapping("/send-message")
    public void sendMessage(@RequestBody NotificationDto notification) {
        notification.setTime(LocalDateTime.now().toString()); // 현재 시간 설정

        // 실제 쪽지 전송 로직 (데이터베이스 저장 등)
        System.out.println("Message from " + notification.getSenderId() + " to " + notification.getReceiverId() + ": " + notification.getMessage());

        // 실시간 알림을 보내기 위한 SSE 전송
        sendNotification(notification);
    }

    // 알림을 연결된 클라이언트들에게 전송하는 메서드
    private void sendNotification(NotificationDto notification) {
        String receiverId = notification.getReceiverId();  // receiverId가 String인지 확인
        System.out.println("알림 전송 시 수신자 ID: " + receiverId);
        System.out.println("현재 구독자 리스트: " + clients.keySet());  // 구독자 리스트 로그 출력

        SseEmitter emitter = clients.get(receiverId);
        if (emitter != null) {
            try {
                System.out.println("알림을 전송합니다: " + notification);
                emitter.send(SseEmitter.event().name("message").data(notification));
            } catch (IOException e) {
                System.err.println("알림 전송 중 오류 발생: " + e.getMessage());
                emitter.completeWithError(e);
                clients.remove(receiverId);
            }
        } else {
            System.err.println("수신자를 찾을 수 없습니다: " + receiverId);
        }
    }
}
