package com.izg.back_end.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.izg.back_end.dto.VoteDto;
import com.izg.back_end.dto.VoteResultDto;
import com.izg.back_end.model.PollUserModel;
import com.izg.back_end.repository.PollOptionRepository;
import com.izg.back_end.repository.PollRepository;
import com.izg.back_end.repository.PollUserRepository;

import jakarta.transaction.Transactional;

@Service
public class PollUserService {

	@Autowired
	private PollRepository pollRepository;

	@Autowired
	private PollOptionRepository pollOptionRepository;

	@Autowired
	private PollUserRepository pollUserRepository;

	// 투표 여부 확인
	public boolean hasUserVoted(int pollIdx, String userId) {
		return pollUserRepository.existsByPollIdxAndUserId(pollIdx, userId);
	}

	// 투표
	@Transactional
	public void vote(VoteDto voteDto) {

		boolean existingVote = pollUserRepository.existsByPollIdxAndUserId(voteDto.getPollIdx(), voteDto.getUserId());
		PollUserModel reVote = pollUserRepository.findMyVoteResultByPollIdxAndUserId(voteDto.getPollIdx(), voteDto.getUserId());
		if (existingVote == true) {
			// 투표 수정 로직
			reVote.setSelectedOptionNum(voteDto.getSelectedOptionNum());
			// 더티 체킹 : save를 호출하지 않아도 트랜잭션이 끝날 때 자동으로 업데이트.
			// 그러나 명시적으로 save를 호출하는 것을 권장하는 경우도 있음.

		} else if (existingVote == false) {
			// 새 투표 로직
			PollUserModel newVote = new PollUserModel();
			newVote.setPollIdx(voteDto.getPollIdx());
			newVote.setUserId(voteDto.getUserId());
			newVote.setSelectedOptionNum(voteDto.getSelectedOptionNum());
			pollUserRepository.save(newVote);
		}
	}

	// 접속 중인 사용자가 선택한 번호
	@Transactional
	public int getMyVoteResult(int pollIdx, String userId) {
		PollUserModel vote = pollUserRepository.findMyVoteResultByPollIdxAndUserId(pollIdx, userId);
	    return vote.getSelectedOptionNum();
	}

	// 투표 결과 확인
	@Transactional
	public List<VoteResultDto> getVoteResult(int pollIdx) {
		List<Object[]> results = pollUserRepository.findVoteResultsByPollIdx(pollIdx);
		List<VoteResultDto> voteResults = new ArrayList<>();
		for (Object[] result : results) {
			int choiceIndex = (int) result[0];
			// jpql은 count함수를 long으로 반환
			// 수정: Long 타입으로 반환된 값을 int로 변환하여 사용
			long voteCount = (long) result[1];
			voteResults.add(new VoteResultDto(choiceIndex, voteCount));
		}
		System.out.println("투표 결과 : " + voteResults);

		return voteResults;
	}
}
