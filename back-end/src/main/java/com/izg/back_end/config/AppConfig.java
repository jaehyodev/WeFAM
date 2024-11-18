package com.izg.back_end.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

@Configuration
@PropertySource("classpath:application.properties")
@ComponentScan(basePackages = "com.izg.back_end")
public class AppConfig {

	// 환경 설정
	// 현재 config.properties에 API Key 숨기고 있음.
	@Bean
	public RestTemplate restTemplate(Environment env) {
		RestTemplate restTemplate = new RestTemplate();
		String chatgptApiKey = env.getProperty("ChatGPT_API_KEY");
		restTemplate.getInterceptors().add((request, body, execution) -> {
			request.getHeaders().add("Authorization", "Bearer " + chatgptApiKey);
			return execution.execute(request, body);
		});
		return restTemplate;
	}
}
