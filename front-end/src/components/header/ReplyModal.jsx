// ReplyModal.js
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../right-sidebar/FamilyModal.module.css"; // 새롭게 만든 CSS 파일

const ReplyModal = ({ notification, onClose }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const [users, setUsers] = useState([]);

  const handleSendMessage = () => {
    if (!message || isSending) {
      return;
    }
    setIsSending(true);

    const data = {
      senderId: userData.id,
      senderNick: userData.nick,
      receiverId: notification.senderId, // 알림을 보낸 사용자에게 답장
      message: message,
      time: new Date().toISOString(),
      type: "답장",
      profileImg: userData.profileImg,
    };

    axios
      .post("http://localhost:8089/wefam/send-message", data)
      .then((response) => {
        setIsSending(false);
        onClose(); // 모달 닫기
      })
      .catch((error) => {
        console.error("메시지 전송 실패:", error);
        setIsSending(false);
      });
  };

  return (
    <div className="main">
      <div className={styles.modalOverlay}>
        <div className="modal-content">
          <h2>{notification.senderNick}에게 답장 보내기</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="답장 내용을 입력하세요..."
            className="textarea"
          />
          <div className={styles.modalActions}>
            <button onClick={handleSendMessage} className={styles.sendButton}>
              전송
            </button>
            <button onClick={onClose} className={styles.closeButton}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
