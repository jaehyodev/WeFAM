import React, { useState, useEffect } from "react";
import styles from "./GroupManagement.module.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GroupManagement = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const dispatch = useDispatch(); // Redux 디스패치 사용

  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);
  const userId = useSelector((state) => state.user.userData.id);
  const [familyNick, setFamilyNick] = useState(""); // 현재 가족 이름
  const [newFamilyNick, setNewFamilyNick] = useState(""); // 수정할 가족 이름 상태
  // const [familyMotto, setFamilyMotto] = useState(""); // 현재 가족 가훈
  // const [newFamilyMotto, setNewFamilyMotto] = useState(""); // 수정할 가족 가훈 상태
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 파일 상태
  const [selectedFiles, setSelectedFiles] = useState([]); // 여러 파일을 저장할 배열 상태 추가


  // 사용자 정보가 로드된 후 가족 이름과 가훈을 서버에서 불러오기 위한 useEffect
  useEffect(() => {
    console.log(userData);

    if (userData) {
      // 가족 이름 불러오기
      axios.get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then(response => {
          setFamilyNick(response.data); // 서버에서 가져온 가족 이름 설정
          setNewFamilyNick(response.data); // 수정할 이름을 현재 가족 이름으로 설정
        })
        .catch(error => {
          console.error("가족 이름을 가져오는 중 에러 발생:", error);
        });

      // 가족 가훈 불러오기
      // axios.get(`http://localhost:8089/wefam/get-family-motto/${userData.id}`)
      //   .then(response => {
      //     setFamilyMotto(response.data); // 서버에서 가져온 가훈 설정
      //     setNewFamilyMotto(response.data); // 수정할 가훈을 현재 가훈으로 설정
      //   })
      //   .catch(error => {
      //     console.error("가훈을 가져오는 중 에러 발생:", error);
      //   });

      fetchProfileImage();
    }
  }, [userData]);

  // 가족 이름 입력 필드의 값이 변경될 때 호출되는 함수
  const handleFamilyNickChange = (e) => {
    setFamilyNick(e.target.value); // 입력된 가족 이름을 상태로 설정
  };

  //  가족 가훈 입력 필드의 값이 변경될 때 호출되는 함수
  // const handleFamilyMottoChange = (e) => {
  //   setNewFamilyMotto(e.target.value); // 입력된 가훈을 상태로 설정
  // };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);  // 여러 파일을 배열로 저장
    setSelectedFiles(files);                   // 선택한 파일들을 상태로 저장
    setProfileImage(URL.createObjectURL(files[0])); // 첫 번째 파일 미리보기
  };

  // 가족 이름을 서버에 업데이트하는 함수
  const updateFamilyNick = () => {
    if (!familyNick) {
      alert("가족 이름을 입력하세요."); // 가족 이름이 비어있는지 확인
      return;
    }

    const updatedFamily = {
      familyIdx: 1, // 가족 ID (실제로는 동적으로 받아와야 함)
      familyNick: familyNick, // 업데이트할 가족 이름
      userId: userData.id, // 현재 사용자의 ID
    };

    axios.put('http://localhost:8089/wefam/update-family-nick', updatedFamily)
      .then(response => {
        setNewFamilyNick(familyNick); // 상태를 직접 업데이트하여 화면에 즉시 반영
        console.log('가족 이름 업데이트 성공:', response.data);
      })
      .catch(error => {
        console.error('가족 이름 업데이트 실패:', error); // 에러 처리
      });
  };

  // // 가족 가훈을 서버에 업데이트하는 함수
  // const updateFamilyMotto = () => {
  //   const updatedFamily = {
  //     familyIdx: 1, // 가족 ID (실제로는 동적으로 받아와야 함)
  //     familyMotto: newFamilyMotto, // 업데이트할 가족 가훈
  //     userId: userData.id, // 현재 사용자의 ID
  //   };

  //   axios.put('http://localhost:8089/wefam/update-family-motto', updatedFamily)
  //     .then(response => {
  //       setFamilyMotto(newFamilyMotto); // 상태를 직접 업데이트하여 화면에 즉시 반영
  //       console.log('가훈 업데이트 성공:', response.data);
  //     })
  //     .catch(error => {
  //       console.error('가훈 업데이트 실패:', error); // 에러 처리
  //     });
  // };

  // 가족 프로필 사진 저장 함수
  const saveProfileImage = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
      formData.append("fileNames", file.name);
      formData.append("fileExtensions", file.name.split(".").pop());
      formData.append("fileSizes", file.size);
    });

    formData.append("familyIdx", userData.familyIdx);
    formData.append("userId", userId);
    formData.append("entityType", "family");  // 'family' 타입으로 변경
    formData.append("entityIdx", 0);

    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/add-album-img", // 엔드포인트는 그대로
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setProfileImage(URL.createObjectURL(selectedFiles[0])); // 상태를 업데이트하여 새로운 이미지 즉시 반영
      } else {
        console.error("프로필 사진 저장 실패:", response);
      }
    } catch (error) {
      console.error("프로필 사진 저장 중 오류 발생:", error);
    }
  };

  // 가족 프로필 불러오기
  const fetchProfileImage = () => {
    const url = `http://localhost:8089/wefam/get-album-images/${userData.familyIdx}?entityType=family`;

    axios
      .get(url)
      .then((response) => {
        if (response.data.length === 0) {
          setProfileImage(null); // 불러올 이미지가 없을 때 기본 이미지 설정 가능
        } else {
          // entityType이 family인 이미지 중 가장 최신 이미지 사용
          const familyImages = response.data.filter(image => image.entityType === "family");
          if (familyImages.length > 0) {
            const latestFamilyImage = familyImages[familyImages.length - 1]; // 최신 이미지 선택
            setProfileImage(`data:image/${latestFamilyImage.fileExtension};base64,${latestFamilyImage.fileData}`);
          } else {
            console.error("가족 프로필 이미지가 없습니다.");
          }
        }
      })
      .catch((error) => {
        console.error("이미지를 불러오는 중 오류 발생:", error);
      });
  };

  const handleSaveAll = () => {
    alert("저장하신 내용이 변경되었습니다.");
    // 가족 이름, 가훈, 프로필 사진을 모두 저장
    updateFamilyNick();
    // updateFamilyMotto();
    saveProfileImage();
    window.location.reload();
  };
  return (
    <div className="main">
      <div className={styles.family}>
        <div className={styles.personalInfo}>
          <div className={styles.titleAndButton}>
            <h1>가족 정보 관리</h1>

          </div>
          <hr />

          {/* 가족 프로필 사진 영역 */}
          <div className={styles.profileContainer}>
            <span>가족 프로필 사진</span>
            <div className={styles.profileInfo}>
              <img
                src={profileImage} // 프로필 이미지 또는 기본 이미지
                className={styles.profileImg}
                alt="가족사진"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="profileImageInput"
              />
              <label htmlFor="profileImageInput" className={styles.editImgButton}>
                이미지 수정
              </label>

            </div>
          </div>
          <hr className={styles.halfHr} />

          {/* 가족 이름 수정 영역 */}
          <div className={styles.profileContainer}>
            <span>우리 가족 이름</span>
            <div>
              <input
                type="text"
                className={styles.editNick}
                value={familyNick}
                onChange={handleFamilyNickChange}
              />
              <label className={styles.saveImgButton} onClick={handleSaveAll}>
                변경사항 전체 저장
              </label>
            </div>
          </div>
          <hr className={styles.halfHr} />

          {/* 가족 가훈 수정 영역 */}
          {/* <div className={styles.profileContainer}>
        <span>우리 가족 가훈</span>
        <div>
          <input
            type="text"
            className={styles.editNick}
            value={newFamilyMotto}
            onChange={handleFamilyMottoChange}
          />
        </div>
      </div> */}
          {/* <hr className={styles.halfHr}/> */}
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
