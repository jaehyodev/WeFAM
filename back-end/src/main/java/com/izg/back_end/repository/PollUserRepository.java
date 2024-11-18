package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollUserModel;

@Repository
public interface PollUserRepository extends JpaRepository<PollUserModel, Integer> {
	
	boolean existsByPollIdxAndUserId(int pollIdx, String userId);
	
	PollUserModel findMyVoteResultByPollIdxAndUserId(int pollIdx, String userId);

	// 특정 pollId에 대한 투표 결과를 가져옴
	@Query("SELECT p.selectedOptionNum, COUNT(p) FROM PollUserModel p WHERE p.pollIdx = :pollIdx GROUP BY p.selectedOptionNum")
	List<Object[]> findVoteResultsByPollIdx(@Param("pollIdx") int pollIdx);
}
