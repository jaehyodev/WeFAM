package com.izg.back_end.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.PollOptionDto;
import com.izg.back_end.dto.VoteDto;
import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.PollOptionModel;
import com.izg.back_end.model.PollUserModel;
import com.izg.back_end.repository.PollOptionRepository;
import com.izg.back_end.repository.PollRepository;
import com.izg.back_end.repository.PollUserRepository;

@Service
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private PollOptionRepository pollOptionRepository;

    @Autowired
    private PollUserRepository pollUserRepository;

    @Transactional
    public PollModel addPolls(PollDto pollDto) {
        PollModel poll = new PollModel();
        poll.setFeedIdx(pollDto.getFeedIdx());
        poll.setUserId(pollDto.getUserId());
        poll.setPollTitle(pollDto.getPollTitle());
        poll.setCreatedAt(LocalDateTime.now());

        pollRepository.save(poll);

        for (PollOptionDto optionDto : pollDto.getPollOptions()) {
            PollOptionModel option = new PollOptionModel();
            option.setPollIdx(poll.getPollIdx());
            option.setPollOptionNum(optionDto.getPollOptionIdx());
            option.setPollOptionContent(optionDto.getPollOptionContent());
            pollOptionRepository.save(option);
        }

        return poll;
    }

    @Transactional(readOnly = true)
    public List<PollDto> getPollsByFeedIdx(int feedIdx) {
        List<PollModel> polls = pollRepository.findPollsByFeedIdx(feedIdx);

        return polls.stream().map(poll -> {
            List<PollOptionModel> options = pollOptionRepository.findByPollIdx(poll.getPollIdx());
            List<PollOptionDto> optionDtos = options.stream().map(option ->
                new PollOptionDto(option.getPollOptionIdx(), option.getPollOptionContent())
            ).collect(Collectors.toList());

            return new PollDto(
                poll.getPollIdx(), 
                poll.getFeedIdx(), 
                poll.getUserId(), 
                poll.getPollTitle(), 
                poll.getCreatedAt(), 
                optionDtos
            );
        }).collect(Collectors.toList());
    }
}