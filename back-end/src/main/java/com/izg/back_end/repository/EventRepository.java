package com.izg.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.EventModel;

@Repository
public interface EventRepository extends JpaRepository<EventModel, Integer>{
	
	Optional<EventModel> findById(int eventIdx);
}
