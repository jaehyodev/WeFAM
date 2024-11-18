package com.izg.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.izg.back_end.model.PollOptionModel;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOptionModel, Integer> {

	// PollOptionModel 클래스에서 pollIdx 필드를 사용하여 쿼리 메서드를 정의합니다.
	List<PollOptionModel> findByPollIdx(int pollIdx);
}