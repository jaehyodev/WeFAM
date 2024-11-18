package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollOptionModel;
import com.izg.back_end.model.RouletteOptionModel;

@Repository
public interface RouletteOptionRepository extends JpaRepository<RouletteOptionModel, Integer> {

	List<RouletteOptionModel> findByRouletteIdx(int rouletteIdx);
}