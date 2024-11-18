package com.izg.back_end.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ChatbotCompletionRequest {
	
	private String model;
	private List<ChatbotMessage> messages;
	private int max_tokens;
	
	
	public ChatbotCompletionRequest(String model, List<ChatbotMessage> conversationHistory,String prompt, int max_tokens) {
		super();
		this.model = model;
		this.messages =  new ArrayList<>(conversationHistory);
		this.messages.add(new ChatbotMessage("user", prompt));
		this.max_tokens = max_tokens;
	}
}