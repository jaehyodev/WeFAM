import React, { useState, useEffect } from "react";
import styles from "./RightSidebar.module.css";

import { useSelector } from "react-redux";
import axios from "axios";
import FamilyModal from "./FamilyModal";
import crown from "../../assets/images/crown.png";
import ProfileModal from "../user-setting/ProfileModal"; // 프로필 정보 모달

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  const [creatorUserId, setCreatorUserId] = useState(null); // 생성자 ID 상태 추가
  const userData = useSelector((state) => state.user.userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업 상태 추가
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // 팝업 위치 상태
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false); // 쪽지 보내기 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 프로필 모달 상태

  useEffect(() => {
    // 사용자 데이터를 가져오는 axios 요청
    axios
      .get("http://localhost:8089/wefam/get-family")
      .then((response) => {
        const loadedUsers = response.data.map((user) => ({
          name: user.name,
          image: user.profileImg,
          nick: user.nick,
          id: user.id,
          online: false, // 처음엔 전부 오프라인으로 초기화
        }));

        // userData.id와 일치하는 사용자를 배열의 첫 번째로 이동
        const sortedUsers = loadedUsers.sort((a, b) =>
          a.id === userData.id ? -1 : b.id === userData.id ? 1 : 0
        );

        setUsers(sortedUsers);
      })
      .catch((error) => {
        console.error("가져오기 에러!!", error);
      });
  }, [userData]);

  useEffect(() => {
    // 온라인 상태 가져오기
    const fetchOnlineUsers = () => {
      axios
        .get("http://localhost:8089/wefam/online-users")
        .then((response) => {
          const onlineUserIds = response.data; // 온라인 유저 ID 목록

          // 온라인 상태 업데이트
          setUsers((prevUsers) =>
            prevUsers.map((user) => ({
              ...user,
              online: onlineUserIds.includes(user.id),
            }))
          );
        })
        .catch((error) => {
          console.error("온라인 상태 가져오기 에러:", error);
        });
    };

    // 컴포넌트가 마운트될 때와 주기적으로 온라인 상태를 가져옴
    fetchOnlineUsers();
    const intervalId = setInterval(fetchOnlineUsers, 1000); // 10초마다 상태 업데이트

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  useEffect(() => {
    const fetchFamilyCreator = async () => {
      try {
        // 패밀리 생성한 유저 id 가져오기
        const response = await axios.get(
          `http://localhost:8089/wefam/family/user-id/${userData.familyIdx}` // URL 경로
        );

        // 응답 데이터가 직접 ID일 경우
        setCreatorUserId(response.data);
      } catch (error) {
        console.error("Error fetching family data:", error);
      }
    };

    if (userData.familyIdx) {
      fetchFamilyCreator();
    }
  }, []);

  // 온라인 오프라인 적용하기

  // useEffect(()=>{
  //   let idleTime = 0;
  //   const idleLimit =0.5; // 1분 비활성화 시 오프라인 전환

  //   const resetIdleTimer = () => {
  //     idleTime = 0;
  //     updateUserStatus(true) // 활동이 감지되면 온라인으로 변경
  //   };

  //   const updateUserStatus = (isOnline) => {
  //     const updatedUsers = users.map((user) => ({
  //       ...user,
  //       online: user.id === userData.id ? user.online : isOnline // 본인프로필은 상태 안변함
  //     }));
  //     setUsers(updatedUsers);
  //   }

  //   // 활동 감지 이벤트 설정
  //   window.addEventListener("mousemove", resetIdleTimer);
  //   window.addEventListener("keypress", resetIdleTimer);

  //   const idleCheckInterval = setInterval(() =>{
  //     idleTime += 1;
  //     if (idleTime >= idleLimit) {
  //       updateUserStatus(false); // 1분 비활성화 시 오프라인으로 전환
  //     }
  //   }, 200); // 30초마다 체크

  //   return () => {
  //     window.removeEventListener("mousemove", resetIdleTimer);
  //     window.removeEventListener("keypress", resetIdleTimer);
  //     clearInterval(idleCheckInterval); // 컨포넌트가 aunmount될 때 정리
  //   };
  // }, [users]);

  const handleProfileClick = (user, event) => {
    setSelectedUser(user);

    // 클릭한 프로필 이미지의 위치를 계산
    const profileImage = event.currentTarget.getBoundingClientRect();

    const popupX = profileImage.left;
    const popupY = profileImage.top + window.scrollY + profileImage.height;
    console.log("x축", popupX);
    console.log("y축", popupY);

    // 팝업 위치를 설정
    setPopupPosition({ x: popupX, y: popupY });
    setIsPopupVisible(true);

    // 선택된 사용자의 정보를 서버에서 가져오기
    axios
      .get(`http://localhost:8089/wefam/get-user/${user.id}`)
      .then((response) => {
        setSelectedUser(response.data); // 사용자 정보를 받아와서 상태에 저장
        setIsModalOpen(true); // 모달을 열기
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 에러:", error);
      });
  };

  const handleSendMessageClick = () => {
    setIsPopupVisible(false); // 팝업 닫기
    setIsFamilyModalOpen(true); // 쪽지 보내기 모달 열기
  };

  const handleViewProfileClick = () => {
    setIsPopupVisible(false); // 팝업 닫기
    setIsProfileModalOpen(true); // 프로필 모달 열기
  };

  const closeFamilyModal = () => {
    setIsFamilyModalOpen(false);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className={styles.rightSidebar}>
      <div className={styles.onlineFamily}>
        <h2 className={styles.title}>현재 접속중인 가족</h2>
        <hr className={styles.separator} />
        <ul className={styles.userList}>
          {users.length > 0 && users[0].id == userData.id && (
            <>
              <li
                key={users[0].id}
                className={styles.userItem}
                onClick={(e) => handleProfileClick(users[0], e)} // 팝업 열기
                style={{
                  cursor: users[0].id !== userData.id ? "pointer" : "default",
                }}>
                <div className={styles.userImageContainer}>
                  <img
                    src={users[0].image}
                    className={styles.userImage}
                    alt={users[0].name}
                  />
                  <span
                    className={`${styles.status} ${
                      users[0].online ? styles.online : styles.offline
                    }`}></span>
                  {users[0].id == creatorUserId && (
                    <img
                      src={crown}
                      alt='Creator'
                      className={styles.crownIcon}
                    />
                  )}
                </div>

                <span className={styles.userName}>{users[0].name}</span>
                <span>{users[0].nick}</span>
              </li>
              <hr className={styles.separator} />
            </>
          )}
          {users.slice(1).map((user) => (
            <li
              key={user.id}
              className={styles.userItem}
              onClick={(e) => handleProfileClick(user, e)} // 팝업 열기
            >
              <div className={styles.userImageContainer}>
                <img
                  src={user.image}
                  className={styles.userImage}
                  alt={user.name}
                />
                <span
                  className={`${styles.status} ${
                    user.online ? styles.online : styles.offline
                  }`}></span>
                {user.id == creatorUserId && (
                  <img src={crown} alt='Creator' className={styles.crownIcon} />
                )}
              </div>
              <span className={styles.userName}>{user.name}</span>
              <span>{user.nick}</span>
            </li>
          ))}
        </ul>
        {/* 팝업 메뉴 */}
        {isPopupVisible && (
          <div
            className={`${styles.popupMenu} ${
              isPopupVisible ? styles.open : ""
            }`}
            style={{ top: `${popupPosition.y - 130}px` }}>
            <div
              onClick={handleSendMessageClick}
              className={styles.popupMenuItem}>
              쪽지 보내기
            </div>
            <div
              onClick={handleViewProfileClick}
              className={styles.popupMenuItem}>
              정보 확인
            </div>
            <div
              onClick={() => setIsPopupVisible(false)}
              className={styles.popupMenuItem}>
              취소
            </div>
          </div>
        )}
      </div>

      {/* 쪽지 보내기 모달 */}
      {isFamilyModalOpen && (
        <FamilyModal user={selectedUser} onClose={closeFamilyModal} />
      )}

      {/* 프로필 정보 모달 */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onRequestClose={closeProfileModal}
          profile={selectedUser}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default RightSidebar;
