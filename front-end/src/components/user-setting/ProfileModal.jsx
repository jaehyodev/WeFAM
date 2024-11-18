import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import styles from "./ProfileModal.module.css";

Modal.setAppElement("#root");

const emojis = ["👩", "👨", "👧", "🧑", "👴", "🧓"]; // 이모티콘 선택 목록

const ProfileModal = ({
  isOpen,
  onRequestClose,
  profile,
  isEditing,
}) => {
  const [selectedProfile, setSelectedProfile] = useState(profile); // 수정된 프로필 정보 저장
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 선택창 표시 상태


  useEffect(()=>{
    console.log(selectedProfile);
    if(isOpen) {
      setSelectedProfile(profile);
    }
    
  }, [isOpen, profile])     

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSelectedProfile({
      ...selectedProfile,
      [e.target.name]: e.target.value,
    });
  };

  // 이모티콘 선택 핸들러
  const handleEmojiClick = (emoji) => {
    const regex = new RegExp("[" + emojis.join("") + "]", "g");
    const updatedNick = selectedProfile.nick.replace(regex, ""); // 기존 이모티콘 제거
    setSelectedProfile({
      ...selectedProfile,
      nick: updatedNick+emoji, // 새로운 이모티콘 추가
    });
    setShowEmojiPicker(false); // 이모티콘 선택창 닫기
  };

  // 프로필 업데이트 후 저장
  const handleSaveChanges = () => {
    axios
      .put("http://localhost:8089/wefam/update-profile", selectedProfile)
      .then((response) => {
        console.log("프로필 업데이트 성공:", response.data);

        // 사용자 정보를 다시 가져오는 로직 추가
        axios
          .get(`http://localhost:8089/wefam/get-family-nick/${selectedProfile.id}`)
          .then((res) => {
            console.log("최신 사용자 정보:", res.data);
            // 최신 사용자 정보로 state 업데이트
            setSelectedProfile(res.data);
          })
          .catch((error) => {
            console.error("최신 사용자 정보 가져오기 실패:", error);
          });
      
        onRequestClose(); // 저장 후 모달 닫기
      })
      .catch((error) => {
        console.error("프로필 업데이트 실패:", error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="프로필 수정"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.modalTitle}>
        {isEditing ? "내 프로필 수정" : `${profile.name}의 프로필`}
      </h2>

      <div className={styles.profileContainer}>
        <img
          src={selectedProfile.profileImg}
          alt="Profile"
          className={styles.profileImage}
        />
        <div className={styles.profile}>
          {/* 이름 */}
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>이름 :</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={selectedProfile.name}
                onChange={handleInputChange}
                className={`${styles.modalInput} ${styles.modalInputText}`}
              />
            ) : (
              <p>{selectedProfile.name}</p>
            )}
          </div>

          {/* 생년월일 추가 */}
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>생년월일 :</label>
            {isEditing ? (
              <input
                type="date"
                name="birth"
                value={selectedProfile.birth}
                onChange={handleInputChange}
                className={`${styles.modalInput} ${styles.modalInputDate}`}
              />
            ) : (
              <p>{selectedProfile.birth}</p>
            )}
          </div>

          {/* 닉네임 */}
          <div className={styles.profileInfoRow}>
            <label className={styles.modalLabel}>닉네임 :</label>
            {isEditing ? (
              <div className={styles.what}>
                <div className={styles.emojiSelector}>
                  <span
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ cursor: "pointer" }}
                  >
                    👨‍👩‍👦‍👦(이모티콘 변경)
                  </span>
                  {showEmojiPicker && (
                    <div className={styles.emojiPicker}>
                      {emojis.map((emoji) => (
                        <span
                          key={emoji}
                          className={styles.emoji}
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="nick"
                  value={selectedProfile.nick}
                  onChange={handleInputChange}
                  className={`${styles.modalInput} ${styles.modalInputText}`}
                />
              </div>
            ) : (
              <p>{selectedProfile.nick}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {isEditing && (
          <button onClick={handleSaveChanges} className={styles.saveBtn}>
            저장
          </button>
        )}
        <button onClick={onRequestClose} className={styles.closeBtn}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
