package com.izg.back_end.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.izg.back_end.dto.PollDto;
import com.izg.back_end.dto.PollOptionDto;
import com.izg.back_end.dto.RouletteDto;
import com.izg.back_end.dto.RouletteOptionDto;
import com.izg.back_end.model.PollModel;
import com.izg.back_end.model.PollOptionModel;
import com.izg.back_end.model.RouletteModel;
import com.izg.back_end.model.RouletteOptionModel;
import com.izg.back_end.repository.RouletteOptionRepository;
import com.izg.back_end.repository.RouletteRepository;

@Service
public class RouletteService {

    @Autowired
    private RouletteRepository rouletteRepository;

    @Autowired
    private RouletteOptionRepository rouletteOptionRepository;

    @Transactional
    public RouletteModel addRoulettes(RouletteDto rouletteDto) {
        RouletteModel roulette = new RouletteModel();
        roulette.setFeedIdx(rouletteDto.getFeedIdx());
        roulette.setUserId(rouletteDto.getUserId());
        roulette.setRouletteTitle(rouletteDto.getRouletteTitle());
        roulette.setTotalAngle(rouletteDto.getTotalAngle());
        roulette.setSelectedOptionNum(rouletteDto.getSelectedOptionNum());
        roulette.setCreatedAt(LocalDateTime.now());

        rouletteRepository.save(roulette);

        for (RouletteOptionDto optionDto : rouletteDto.getRouletteOptions()) {
            RouletteOptionModel option = new RouletteOptionModel();
            option.setRouletteIdx(roulette.getRouletteIdx());
            option.setRouletteOptionNum(optionDto.getRouletteOptionNum());
            option.setRouletteOptionContent(optionDto.getRouletteOptionContent());
            rouletteOptionRepository.save(option);
        }

        return roulette;
    }
    
    @Transactional(readOnly = true)
    public List<RouletteDto> getRoulettes(int feedIdx) {
        List<RouletteModel> roulettes = rouletteRepository.findByFeedIdx(feedIdx);

        return roulettes.stream().map(roulette -> {
            List<RouletteOptionModel> options = rouletteOptionRepository.findByRouletteIdx(roulette.getRouletteIdx());
            List<RouletteOptionDto> optionDtos = options.stream().map(option ->
                new RouletteOptionDto(option.getRouletteOptionNum(), option.getRouletteOptionContent())
            ).collect(Collectors.toList());

            return new RouletteDto(
            		roulette.getRouletteIdx(), 
            		roulette.getFeedIdx(), 
            		roulette.getUserId(), 
            		roulette.getRouletteTitle(), 
            		roulette.getTotalAngle(),
            		roulette.getSelectedOptionNum(),
            		roulette.getCreatedAt(), 
                optionDtos
            );
        }).collect(Collectors.toList());
    }
}