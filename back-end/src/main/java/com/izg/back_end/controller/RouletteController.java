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

import com.izg.back_end.dto.RouletteDto;
import com.izg.back_end.dto.VoteDto;
import com.izg.back_end.dto.VoteResultDto;
import com.izg.back_end.dto.VoteStatusDto;
import com.izg.back_end.model.RouletteModel;
import com.izg.back_end.service.RouletteService;

@CrossOrigin
@RestController
public class RouletteController {

	@Autowired
	private RouletteService rouletteService;

	// 피드에 있는 룰렛 가져오기
	@GetMapping("/feed/{feedIdx}/roulettes")
	public ResponseEntity<List<RouletteDto>> getRoulettes(@PathVariable("feedIdx") int feedIdx) {
		try {
			List<RouletteDto> rouletteDtos = rouletteService.getRoulettes(feedIdx);
			System.out.println("get-roulettes : " + rouletteDtos);
			return ResponseEntity.ok(rouletteDtos);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/add-roulettes")
	public ResponseEntity<RouletteModel> addRoulettes(@RequestBody RouletteDto rouletteDto) {
		System.out.println("Received roulette dto : " + rouletteDto);
		RouletteModel addedRoulette = rouletteService.addRoulettes(rouletteDto);
		return ResponseEntity.ok(addedRoulette);
	}
}