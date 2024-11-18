package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.JoiningModel;

@Repository
public interface JoiningRepository extends JpaRepository<JoiningModel, Integer> {

	JoiningModel findByUserId(String userId);

	@Query("SELECT j.familyIdx FROM JoiningModel j WHERE j.userId = :userId")
	List<Integer> findFamilyIdxByUserId(@Param("userId") String userId);

	// familyIdx로 구성원 목록을 조회하는 메서드
	List<JoiningModel> findByFamilyIdx(Integer familyIdx);
}