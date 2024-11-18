package com.izg.back_end.controller;

import java.util.ArrayList;
import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.izg.back_end.model.ChatbotCompletionRequest;
import com.izg.back_end.model.ChatbotCompletionResponse;
import com.izg.back_end.model.ChatbotMessage;

import jakarta.servlet.http.HttpSession;

@RestController
public class ChatbotController {

	@Autowired
	private RestTemplate restTemplate;

	List<ChatbotMessage> conversationHistory = new ArrayList<>();
  
	// 초기 대화 기록 설정
	public ChatbotController() {
      
	  // 초기 대화 기록 추가
  	  conversationHistory.add(new ChatbotMessage("system", "너의 이름은 'WeFAM 매니저', 직업은 세계 최고의 여행지 추천전문가야"));
      conversationHistory.add(new ChatbotMessage("system", "유저가 여행지 추천에 대해 질문하면 친절하게 알려줘"));
      conversationHistory.add(new ChatbotMessage("system", "답변을 할 때는 각 정보마다 줄바꿈을 해주세요. "
      		+ "예를 들어 세 가지 정보를 알려줄 때는 다음과 같이 줄바꿈을 포함해서 답변해 주세요:\\n1. 첫 번째 정보\\n2. 두 번째 정보\\n3. 세 번째 정보\\n\""));
      conversationHistory.add(new ChatbotMessage("system", "어조: 친근하게, 존댓말로 해줘"));
      conversationHistory.add(new ChatbotMessage("system", "대답중 마지막엔 `마음에 드시는 계획을 선택해 주세요! \\n\\n 마음에 드시지 않는다면 저에게 다시 물어봐주세요😘😘` 이렇게 말해줘"));
      conversationHistory.add(new ChatbotMessage("system", "유저가 여행테마를 산, 실내여행지, 액티비티, 축제, 상관없음 다섯개중에 고를건데"
      		+ " 선택한 테마와 날짜를 기반으로 선택한 장소가 있는 지역에 고른 테마에 맞는 주변 추천 정확한 장소명칭을 꼭 세개정도 알려줘. 만약 상관없음을 고른다면 선택한 장소 주변에서 방문할만한 곳을 추천해주면돼."));
//      conversationHistory.add(new ChatbotMessage("system", "답변을 해줄땐 꼭 정확한 장소명칭만을 말해주고 부가적인 설명은 줄바꿈된 곳에 설명해줘 꼭!"));
//      conversationHistory.add(new ChatbotMessage("system", "답변 형태는 (숫자). ** 답변 ** 이러한 형태로해줘."));
//      conversationHistory.add(new ChatbotMessage("system", "사용자가 테마를 골랐다면 그 테마를 할 수 있는 장소를 알려줘야돼. "
//      		+ "예를들어 장소는 해운대해수욕장을고르고 테마는 축제를 골랐다면 해운대해수욕장 근처에서 열리는 축제 장소위치를 알려주는거야. "));
	}

	@PostMapping(value = "/chatbot/hitopenaiapi", produces = "application/text; charset=utf8")
	public String getOpenaiResponse(@RequestBody String prompt, HttpSession session) {

		// 최대로 출력 가능한 AI의 답변
		int max_tokens = 2048;
		
		// 사용자가 보낸 새로운 질문을 conversationHistory에 추가
		conversationHistory.add(new ChatbotMessage("user", prompt));
		System.out.println(new ChatbotMessage("user", prompt));
		// 오래된 대화를 지우기 위해 오래된 메시지들을 제거
	    if (conversationHistory.size() > 10) {
	        // 가장 오래된 5개의 메시지를 제거
	        conversationHistory = conversationHistory.subList(conversationHistory.size() - 10, conversationHistory.size());
	    }

		// 사용자의 요청에 현재의 메세지가 아닌 conversationHistory를 보내어 사용자와 AI의 대화 기록을 전부 보냄
		ChatbotCompletionRequest chatCompletionRequest = new ChatbotCompletionRequest("gpt-3.5-turbo-0125", conversationHistory, prompt,
				max_tokens);
		
		// AI의 답변을 받음
		ChatbotCompletionResponse response = restTemplate.postForObject("https://api.openai.com/v1/chat/completions",
				chatCompletionRequest, ChatbotCompletionResponse.class);

		// AI의 답변을 변수로 할당
		String responseData = response.getChoices().get(0).getMessage().getContent();
		System.out.println(responseData);
		
		// AI의 답변을 conversationHistory에 추가
		conversationHistory.add(new ChatbotMessage("assistant", responseData));

		return responseData;
	}
}
