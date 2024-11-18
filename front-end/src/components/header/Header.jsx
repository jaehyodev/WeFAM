import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleLeftSidebar } from "../../features/leftSidebarSlice";
import styles from "./Header.module.css";
import { HiMiniBars3 } from "react-icons/hi2";
import logo from "../../assets/images/logo-text-segoe.png";
import iconHeaderAlarm from "../../assets/images/icon-header-alarm.png";
import iconHeaderTrophy from "../../assets/images/icon-header-trophy.png";
import { GoBell } from "react-icons/go";
import { HiOutlineTrophy } from "react-icons/hi2";
import AlarmModal from "./AlarmModal";
import { NotificationContext } from "../../NotificationContext";
import ProfileModal from "../user-setting/ProfileModal";
import { updateUserData } from "../../features/userSlice"; // 유저 데이터를 업데이트하는 액션 임포트

const Header = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [familyMotto, setFamilyMotto] = useState("");
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [groups, setGroups] = useState([]); // 그룹 목록 상태
  const [isAddCircleOpen, setIsAddCircleOpen] = useState(false);
  const [isAlarm, setIsAlarm] = useState(false);
  const alarmRef = useRef(null); // 알람 모달 감지용 ref
  const bellRef = useRef(null); // bell 아이콘 감지용 ref
  const { notifications } = React.useContext(NotificationContext);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 프로필 모달 상태

  // Redux에서 사용자 정보 가져오기
  const userData = useSelector((state) => state.user.userData);

  // 본인 계정과 일치하는 알림 개수 필터링
  const filteredNotifications = userData
    ? notifications.filter(
        (notification) => notification.receiverId === userData.id
      )
    : [];

  useEffect(() => {
    if (userData) {
      // 여기서 최신 데이터를 불러오는 로직
      axios
        .get("http://localhost:8089/wefam/get-family")
        .then((response) => {
          const loadedImages = response.data.map((user) => user.profileImg);
          setUserImages(loadedImages); // 이미지 업데이트
        })
        .catch((error) => {
          console.error("가져오기 에러!!", error);
        });

      axios
        .get(`http://localhost:8089/wefam/get-family-nick/${userData.id}`)
        .then((response) => {
          setFamilyMotto(response.data); // 가훈 업데이트
        })
        .catch((error) => {
          console.error("가훈 가져오기 에러:", error);
        });
    }
  }, [userData]); // userData가 변경될 때마다 실행

  const handleMottoChange = (e) => {
    setFamilyMotto(e.target.value);
  };

  const updateFamilyMotto = () => {
    if (!familyMotto) {
      alert("가훈을 입력하세요.");
      return;
    }
    const updatedFamily = {
      familyIdx: 1,
      familyMotto: familyMotto,
      userId: userData.id,
    };

    axios
      .put("http://localhost:8089/wefam/update-family-motto", updatedFamily)
      .then((response) => {
        console.log("가훈 업데이트 성공:");
      })
      .catch((error) => {
        console.error("가훈 업데이트 실패:", error);
      });
  };

  const handleBellClick = () => {
    setIsAlarm(!isAlarm);
  };

  const handleTrophyClick = () => {
    nav("/main/reward");
  };

  const handleProfileClick = () => {
    if (userData) {
      setIsProfileModalOpen(true); // 프로필 모달 열기
    } else {
      alert("사용자 데이터가 없습니다.");
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    console.log("ㅅㅂ", userData.birth);

    // 모달이 닫힌 후, DB에서 최신 사용자 정보 다시 가져오기
    axios
      .get(`http://localhost:8089/wefam/get-user/${userData.id}`)
      .then((response) => {
        dispatch(updateUserData(response.data)); // Redux에 최신 데이터 업데이트
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 에러:", error);
      });
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <nav>
          <div className={styles.menuBtnContainer}>
            <button className={styles.menuBtn}>
              {/* 왼쪽 미니바 */}
              <HiMiniBars3
                className={styles.menuIcon}
                onClick={() => dispatch(toggleLeftSidebar())}
              />
            </button>
          </div>
          <div
            className={styles.logoContainer}
            onClick={() => nav("/main")}
            style={{ cursor: "pointer" }}>
            {/* WeFAM 로고 */}
            <img className={styles.logo} src={logo}></img>
          </div>
          <div className={styles.groupContainer}>{familyMotto}</div>
          <div className={styles.infoContainer}>
            <div className={styles.infoField}>
              <div
                className={styles.icon}
                onClick={handleBellClick}
                ref={bellRef}>
                <img
                  src={iconHeaderAlarm}
                  alt=''
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "inline-block",
                    padding: "2px",
                  }}
                />
                {/* <GoBell /> */}
                {filteredNotifications.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-3px",
                      background: "var(--color-sunset)",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}>
                    {filteredNotifications.length}
                  </div>
                )}
              </div>
              {isAlarm && (
                <div ref={alarmRef} style={{ position: "absolute" }}>
                  <AlarmModal />
                </div>
              )}
              <div className={styles.icon} onClick={handleTrophyClick}>
                <i
                  style={{
                    backgroundImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/jGIHAYEO3Pc.png")',
                    backgroundSize: "auto",
                    width: "36px",
                    height: "36px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                  }}
                  aria-hidden='true'></i>
                {/* <HiOutlineTrophy /> */}
              </div>
              <div
                className={styles.profileImageWrapper}
                onClick={handleProfileClick}>
                <img
                  src={userData.profileImg}
                  className={styles.profileImage}
                  alt='사용자 프로필'
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* ProfileModal - 모달이 열려 있을 때만 렌더링 */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onRequestClose={closeProfileModal}
          profile={userData} // userData를 profile prop으로 넘겨줌
          isEditing={true} // 자기 자신만 수정 가능
        />
      )}
    </div>
  );
};

export default Header;
