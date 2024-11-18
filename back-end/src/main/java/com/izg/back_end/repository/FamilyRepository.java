package com.izg.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.FamilyModel;

@Repository
public interface FamilyRepository extends JpaRepository<FamilyModel, Integer> {
	
	@Query("SELECT f.userId FROM FamilyModel f WHERE f.familyIdx = :familyIdx")
    String findUserIdByFamilyIdx(@Param("familyIdx") int familyIdx);
}
