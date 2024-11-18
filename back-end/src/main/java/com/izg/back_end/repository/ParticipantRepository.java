package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.ParticipantModel;

@Repository
public interface ParticipantRepository extends JpaRepository<ParticipantModel, Integer> {
	void deleteByEntityIdxAndEntityType(int entityIdx, String entityType);

	List<ParticipantModel> findAllByEntityIdxAndEntityType(int entityIdx, String entityType);
}