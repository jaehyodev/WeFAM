package com.izg.back_end.service;

import com.izg.back_end.dto.UserDto;
import com.izg.back_end.model.FileModel;
import com.izg.back_end.model.JoiningModel;
import com.izg.back_end.model.LogModel;
import com.izg.back_end.model.UserModel;
import com.izg.back_end.repository.FileRepository;
import com.izg.back_end.repository.JoiningRepository;
import com.izg.back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JoiningRepository joiningRepository;
	
	 @Autowired
	    private FileRepository fileRepository;  // FileRepository 주입
	

	// 인가 코드를 사용하여 액세스 토큰을 가져옴
	public String getKakaoAccessToken(String code) {
		String tokenUri = "https://kauth.kakao.com/oauth/token";
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", "d6186debb41ea416a5c25ba1aa1b8161"); // 여기에 실제 카카오 REST API 키를 입력하세요
		params.add("redirect_uri", "http://localhost:3000");
		params.add("code", code);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
		ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, request, Map.class);

		if (response.getStatusCode() == HttpStatus.OK) {
			Map<String, Object> responseBody = response.getBody();
			return responseBody != null ? (String) responseBody.get("access_token") : null;
		} else {
			throw new RuntimeException("엑세스 토큰 얻기 실패");
		}
	}

	// 카카오 서버에서 유저 정보를 받아옴
		public UserDto getUserInforFromKakao(String accessToken) {
			String userInfoUri = "https://kapi.kakao.com/v2/user/me";
			RestTemplate restTemplate = new RestTemplate();

			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + accessToken);

			HttpEntity<String> entity = new HttpEntity<>(headers);
			ResponseEntity<Map> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, entity, Map.class);

			Map<String, Object> responseBody = response.getBody();
			if (responseBody == null) {
				throw new RuntimeException("Failed to get user info from Kakao");
			}

			Map<String, Object> properties = (Map<String, Object>) responseBody.get("properties");
			Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");

			UserDto userDTO = new UserDto();
			userDTO.setId(responseBody.get("id").toString());
			userDTO.setName(properties.get("nickname").toString());
			userDTO.setNick(properties.get("nickname").toString());
			userDTO.setProfileImg(properties.get("profile_image").toString());
			userDTO.setLoginSource("kakao");
			userDTO.setJoinedAt(LocalDateTime.now());

			if (kakaoAccount.get("birthday") != null) {
				String birthday = kakaoAccount.get("birthday").toString();
				int currentYear = LocalDate.now().getYear();
				userDTO.setBirth(
						LocalDate.parse(currentYear + "-" + birthday.substring(0, 2) + "-" + birthday.substring(2)));
			} else {
				// 기존 DB에서 생년월일을 불러와 저장
				UserModel existingUser = userRepository.findById(userDTO.getId()).orElse(null);
				if (existingUser != null) {
					userDTO.setBirth(existingUser.getBirth());  // 기존 생년월일 유지
				} else {
					userDTO.setBirth(LocalDate.now());
				}
			}

			userDTO.setAccessToken(accessToken);
			return userDTO;
		}

	// 유저 정보를 데이터베이스에 저장
	public void saveUser(UserDto userDTO, String accessToken) {
		// 기존 사용자 확인
		UserModel existingUser = userRepository.findById(userDTO.getId()).orElse(null);

		if (existingUser != null) {
			// 기존 사용자 정보 업데이트 시 생년월일 유지
			if (userDTO.getBirth() == null) {
				userDTO.setBirth(existingUser.getBirth()); // 기존 생년월일 유지
			}

			// 1. 닉네임 업데이트 조건: DB에 저장된 닉네임과 동일하지 않다면 업데이트하지 않음
			if (!existingUser.getNick().equals(userDTO.getNick())) {
				userDTO.setNick(existingUser.getNick()); // 기존 닉네임 유지
			}

			// 2. 이름 업데이트 조건: DB에 저장된 이름과 동일하지 않다면 업데이트하지 않음
			if (!existingUser.getName().equals(userDTO.getName())) {
				userDTO.setName(existingUser.getName()); // 기존 이름 유지
			}

//			// 3. 프로필 이미지 업데이트 조건
//			if (!existingUser.getProfileImg().equals(userDTO.getProfileImg())) {
//				userDTO.setProfileImg(existingUser.getProfileImg()); // 기존 프로필 이미지 유지
//			}

			// 사용자 정보 업데이트
			existingUser.setNick(userDTO.getNick());
			existingUser.setName(userDTO.getName());
			existingUser.setProfileImg(userDTO.getProfileImg());
			existingUser.setLoginSource(userDTO.getLoginSource());

			// 생년월일 정보도 필요할 때만 업데이트 (null 값이 아닌 경우에만 업데이트)
			if (userDTO.getBirth() != null) {
				existingUser.setBirth(userDTO.getBirth());
			}

			// 사용자 정보 저장
			userRepository.save(existingUser);

		} else {
			// 새로운 사용자 저장
			UserModel newUser = new UserModel();
			newUser.setId(userDTO.getId());
			newUser.setName(userDTO.getName());
			newUser.setNick(userDTO.getNick());
			newUser.setBirth(userDTO.getBirth()); // 새 유저라면 null 일 수도 있으니 그대로 설정
			newUser.setProfileImg(userDTO.getProfileImg());
			newUser.setJoinedAt(userDTO.getJoinedAt());
			newUser.setLoginSource(userDTO.getLoginSource());

			userRepository.save(newUser);
		}
	}

	public List<UserModel> getUsersInJoining() {
		// Joining 테이블의 모든 항목을 가져옴
		List<JoiningModel> joiningList = joiningRepository.findAll();

		// User 테이블에서 user_id와 일치하는 사용자 정보 가져오기
		return joiningList.stream().map(joining -> userRepository.findById(joining.getUserId()).orElse(null))
				.filter(user -> user != null) // null 값 필터링
				.collect(Collectors.toList());
	}

//	public List<LogModel> getFamilyStaus(){
//		return userRepository.findAll();
//	}

	// 닉네임 수정하면 db에 저장하기위한거
	public UserModel updateUserProfile(UserModel updatedUser) {
		// 기존 사용자 정보를 가져와서 업데이트
		UserModel user = userRepository.findById(updatedUser.getId())
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setName(updatedUser.getName());
		user.setNick(updatedUser.getNick());
		user.setBirth(updatedUser.getBirth());
		user.setProfileImg(updatedUser.getProfileImg());

		return userRepository.save(user);
	}

	// 가족 프로필 사진 가져오기
	public FileModel getProfileImageByFamilyIdx(int familyIdx, String entityType) {
		return fileRepository.findLatestByFamilyIdxAndEntityType(familyIdx, entityType);
	}
	
	// 업데이트된 프로필 가져오기
	public UserModel getUserById(String id) {
	    return userRepository.findById(id).orElse(null);
	}
}