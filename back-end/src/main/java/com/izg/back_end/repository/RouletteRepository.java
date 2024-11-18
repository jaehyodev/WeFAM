package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.RouletteModel;

@Repository
public interface RouletteRepository extends JpaRepository<RouletteModel, Integer> {

	@Query("SELECT r FROM RouletteModel r WHERE r.feedIdx = :feedIdx")
    List<RouletteModel> findByFeedIdx(@Param("feedIdx") int feedIdx);
}