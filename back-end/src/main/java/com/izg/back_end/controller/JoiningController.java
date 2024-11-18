package com.izg.back_end.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.izg.back_end.model.JoiningModel;
import com.izg.back_end.service.JoiningService;

@RestController
public class JoiningController {

	@Autowired
	private JoiningService joiningService;

	@GetMapping("/get-joiningData/{id}")
	public ResponseEntity<JoiningModel> getFamilyData(@PathVariable("id") String id) {
		System.out.println("Received User ID: " + id);

		JoiningModel joiningModel = joiningService.getJoiningByUserId(id);
		System.out.println("Family Index: " + joiningModel.getFamilyIdx());

		return ResponseEntity.ok(joiningModel);
	}

	@GetMapping("/get-family-members/{userId}")
	public ResponseEntity<List<Map<String, Object>>> getFamilyMembersByUserId(@PathVariable("userId") String userId) {
		List<Map<String, Object>> familyMembers = joiningService.getMembersByUserId(userId);

		if (familyMembers == null || familyMembers.isEmpty()) {
			return ResponseEntity.status(404).body(null);
		}

		return ResponseEntity.ok(familyMembers);
	}
}