import React, { useContext, useState } from "react";
import { NotificationContext } from "../../NotificationContext";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import style from "./Header.module.css";
import { elapsedTime } from "../../elapsedTime";
import styles from "./AlarmModal.module.css";
import ReplyModal from "./ReplyModal"; // 새롭게 만든 ReplyModal 추가
import { useSelector } from "react-redux"; // Redux에서 로그인 사용자 정보를 가져오기 위함

const AlarmModal = () => {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [selectedNotification, setSelectedNotification] = useState(null); // 선택된 알림 상태
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const userData = useSelector((state) => state.user.userData); // 현재 로그인한 사용자 정보

  // 답장 버튼 클릭 핸들러 (모달 열기)
  const handleReply = (notification) => {
    setSelectedNotification(notification);
  };

  // 알림 삭제 핸들러
  const handleDeleteNotification = (e, id) => {
    e.stopPropagation(); // 이벤트 전파 중지
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  // 모달 닫기 핸들러
  const closeReplyModal = () => {
    setSelectedNotification(null);
  };

  return ReactDOM.createPortal(
    <div
      style={{
        backgroundColor: "#ffffff",
        marginTop: "2rem",
        borderRadius: "1rem",
        padding: "1rem",
        position: "absolute",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "300px",
        zIndex: 2000,
        right: 0,
        top: 30,
      }}
    >
      <div>알림</div>
      {notifications.length === 0 ? (
        <p>새로운 메시지가 없습니다.</p>
      ) : (
        notifications
          .filter((notification) => notification.receiverId === userData.id) // 필터링 조건
          .map((notification, index) => (
            <div
              // to={notification?.link || "/"}
              key={notification.id || index}
              className={style.notificationLink}
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => handleReply(notification)} // 답장 모달 열기
            >
              <div
                style={{
                  borderBottom: "1px solid #e0e0e0",
                  padding: "0.5rem 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={notification.profileImg}
                    className={style.notificationIcon3}
                    alt="Profile Image"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontWeight: "bold" }}>
                    {notification.senderNick || "알림 제목"}
                  </span>
                  <span
                    onClick={(e) =>
                      handleDeleteNotification(e, notification.id)
                    } // 삭제 버튼 클릭 시 이벤트 전파 막음
                    className={styles.notificationClose}
                  >
                    &times;
                  </span>
                </div>
                <div style={{ cursor: "pointer" }}>
                  <p style={{ fontSize: "12px", color: "#757575" }}>
                    {elapsedTime(notification.time)} {/* 시간 차이 출력 */}
                  </p>
                  <p className={style.notificationDescription}>
                    {notification.message || "메시지 내용 없음"}
                  </p>
                  <p
                    className={style.notificationType}
                    style={{ fontSize: "12px", color: "#757575" }}
                  >
                    {notification.type || "알림 유형 없음"}
                  </p>
                </div>
              </div>
            </div>
          ))
      )}
      {/* ReplyModal을 답장 모달로 활용 */}
      {selectedNotification && (
        <ReplyModal
          notification={selectedNotification}
          onClose={closeReplyModal}
        />
      )}
    </div>,
    document.body
  );
};

export default AlarmModal;
