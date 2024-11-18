package com.izg.back_end.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.EventModel;
import com.izg.back_end.model.FeedModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.service.EventService;
import com.izg.back_end.service.FamilyService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@CrossOrigin
public class EventController {

	private final EventService eventService;
	
	private final FamilyService familyService;

	@Autowired
	public EventController(EventService eventService, FamilyService familyService) {
		this.eventService = eventService;
		this.familyService = familyService;
	}

	@GetMapping("/calendar")
	public List<EventModel> getEvents() {
		return eventService.getEventList();
	}

	@PostMapping("/update-event/{eventIdx}")
	public EventModel updateEvent(@PathVariable("eventIdx") int eventIdx, @RequestBody EventModel eventModel) {
		Optional<EventModel> existingEvent = eventService.getEventById(eventIdx);
		if (existingEvent.isPresent()) {
			eventModel.setEventIdx(eventIdx); // 기존 ID 유지
			return eventService.updateEvent(eventModel);
		} else {
			throw new RuntimeException("작업을 찾을 수 없습니다.");
		}
	}

	@PostMapping("/add-event")
	public EventModel addEvent(@RequestBody EventModel eventModel) {

		return eventService.updateEvent(eventModel); // 새로운 이벤트를 추가하는 서비스 메서드 호출
	}

	@DeleteMapping("/delete-event/{eventId}")
	public ResponseEntity<Void> deleteEvent(@PathVariable("eventId") int eventId) {
		try {
			eventService.deleteEvent(eventId);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	// 특정 유저의 패밀리 이름을 가져오는 API
    @GetMapping("/family-name/{LoginId}")
    public ResponseEntity<Map<String, Object>> getFamilyInfo(@PathVariable("LoginId") String LoginId) {
        Map<String, Object> familyInfo = familyService.getFamilyInfoByUserId(LoginId);
        if (familyInfo != null) {
            return ResponseEntity.ok(familyInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

	// 특정 유저의 패밀리에 속한 리스트를 가져오는 API
	@GetMapping("/family-users/{LoginId}")
	public ResponseEntity<List<UserModel>> getUsersByFamilyIdx(@PathVariable("LoginId") String LoginId) {
		List<UserModel> users = familyService.getUsersByFamilyIdx(LoginId);
		if (!users.isEmpty()) {
			return ResponseEntity.ok(users);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}
