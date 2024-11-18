package com.izg.back_end.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.model.EventModel;
import com.izg.back_end.repository.EventRepository;
import com.izg.back_end.repository.UserRepository;

@Service
public class EventService {
	
	@Autowired
	EventRepository eventRepository;
	EventModel eventModel;
	
	@Autowired
    private UserRepository userRepository;
	
	// 일정 불러오기
	public List<EventModel> getEventList() {
		return	eventRepository.findAll();
		
	}
	
	//일정 추가 삭제
	public EventModel updateEvent(EventModel eventModel) {
		// 사용자 유효성 검사를 추가
        if (!userRepository.existsById(eventModel.getUserId())) {
            throw new IllegalArgumentException("Invalid user ID");
        }
		return eventRepository.save(eventModel);
	}
	
	//특정 일정 조회
	public Optional<EventModel> getEventById(int eventIdx) {
		return eventRepository.findById(eventIdx);
	}
	
	//일정 삭제
	public void deleteEvent(int eventIdx) {
        eventRepository.deleteById(eventIdx);
    }
}
