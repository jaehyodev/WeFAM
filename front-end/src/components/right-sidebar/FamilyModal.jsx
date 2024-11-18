import React, { useState } from "react";
import styles from "./FamilyModal.module.css";
import axios from "axios";
import { useSelector } from "react-redux";

const FamilyModal = ({ user, onClose }) => {
  const [message, setMessage] = useState("");
  const userData = useSelector((state) => state.user.userData);
  const [isSending, setIsSending] = useState(false);

  console.log("체크용", user);

  const handleSendMessage = () => {
    if (!message || isSending) {
      return;
    }
    setIsSending(true); // 메시지 전송 중 상태로 설정

    const data = {
      senderId: userData.id,
      senderNick: userData.nick,
      receiverId: user.id,
      message: message,
      time: new Date().toISOString(),
      type: "쪽지",
      profileImg: userData.profileImg,
    };

    axios
      .post("http://localhost:8089/wefam/send-message", data)
      .then((response) => {
        setIsSending(false);
        onClose();
      })
      .catch((error) => {
        console.error("쪽지 전송 실패:", error);

        setIsSending(false);
      });
  };

  return (
    <div className='main'>
      <div className={styles.modalOverlay}>
        <div className='modal-content'>
          <h2>{user.nick} 에게 쪽지 보내기</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='쪽지 내용을 입력하세요...'
            className='textarea'
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

export default FamilyModal;
