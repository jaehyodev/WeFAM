package com.izg.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.izg.back_end.model.HouseworkModel;

public interface HouseworkRepository extends JpaRepository<HouseworkModel, Integer> {

	Optional<HouseworkModel> findById(int workIdx);

	void deleteById(int workIdx);

	HouseworkModel findByWorkIdx(int workIdx);

}