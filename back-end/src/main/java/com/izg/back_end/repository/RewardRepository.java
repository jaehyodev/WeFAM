package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.RewardModel;

public interface RewardRepository extends JpaRepository<RewardModel, Integer> {

	List<RewardModel> findByPurchase(String userId);

}
