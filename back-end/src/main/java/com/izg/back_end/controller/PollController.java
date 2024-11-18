package com.izg.back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.VoteDto;
import com.izg.back_end.dto.VoteResultDto;
import com.izg.back_end.dto.VoteStatusDto;
import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.PollUserModel;
import com.izg.back_end.service.PollService;
import com.izg.back_end.service.PollUserService;

@CrossOrigin
@RestController
public class PollController {

	@Autowired
	private PollUserService pollUserRepository;
	@Autowired
	private PollUserService pollUserService;
	@Autowired
	private PollService pollService;

	// 피드에 있는 투표 가져오기
	@GetMapping("/get-polls/{feedIdx}")
	public ResponseEntity<List<PollDto>> getPolls(@PathVariable("feedIdx") int feedIdx) {
		try {
			List<PollDto> pollDtos = pollService.getPollsByFeedIdx(feedIdx);
			System.out.println("get-polls : " + pollDtos);
			return ResponseEntity.ok(pollDtos);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/add-polls")
	public ResponseEntity<PollModel> addPolls(@RequestBody PollDto pollDto) {
		System.out.println("Received poll dto : " + pollDto);
		PollModel addedPoll = pollService.addPolls(pollDto);
		return ResponseEntity.ok(addedPoll);
	}

	@PostMapping("/vote")
	public ResponseEntity<Void> vote(@RequestBody VoteDto voteDto) {
		pollUserService.vote(voteDto);
		return ResponseEntity.ok().build();
	}

	// 현재 접속 중이 사용자가 투표를 열었을 때 투표했는 지 확인하기
//    @GetMapping("/get-poll/{pollIdx}/user/{userId}/status")
//    public ResponseEntity<VoteDto> getUserVote(@PathVariable("pollIdx") int pollIdx, @PathVariable("userId") String userId) {
//        try {
//            PollUserModel vote = pollUserRepository.existsByPollIdxAndUserId(pollIdx, userId);
//            if (vote != null) {
//                VoteDto voteDto = new VoteDto(vote.getPoll().getPollIdx(), vote.getUserId(), vote.getPollOption().getPollOptionIdx());
//                return ResponseEntity.ok(voteDto);
//            } else {
//                return ResponseEntity.noContent().build();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

	// 현재 접속 중인 사용자가 투표를 했는 지 확인
	@GetMapping("/get-poll/{pollIdx}/user/{userId}/status")
	public ResponseEntity<VoteStatusDto> getVoteStatus(@PathVariable("pollIdx") int pollIdx,
			@PathVariable("userId") String userId) {
		try {
			boolean hasVoted = pollUserService.hasUserVoted(pollIdx, userId);
			return ResponseEntity.ok(new VoteStatusDto(hasVoted));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// 현재 사용자가 선택한 투표 번호
	@GetMapping("/get-my-vote-result/poll/{pollIdx}/user/{userId}")
    public ResponseEntity<Integer> getMyVoteResult(@PathVariable("pollIdx") int pollIdx,
			@PathVariable("userId") String userId) {
		int selectedOptionNum = pollUserService.getMyVoteResult(pollIdx, userId);
	    return ResponseEntity.ok(selectedOptionNum);
    }

	// 투표 결과 확인
	@GetMapping("/get-vote-result/{pollIdx}")
	public ResponseEntity<List<VoteResultDto>> getVoteResult(@PathVariable("pollIdx") int pollIdX) {
		try {
			List<VoteResultDto> results = pollUserService.getVoteResult(pollIdX);
			System.out.println("투표 결과 확인 : " + results);
			return ResponseEntity.ok(results);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}