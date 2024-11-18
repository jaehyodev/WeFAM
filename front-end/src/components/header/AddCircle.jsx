import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./AddCircle.module.css";
import AddIcon from "../../assets/images/icon-invitation.png";

const AddCircle = ({ isOpen, onRequestClose }) => {
  const [link, setLink] = useState("https://WeFAM-invite-link.com"); // 초대 링크

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert("링크가 복사되었습니다.");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}>
      <div className={styles.modalHeader}>
        <h2>가족 초대하기</h2>
        <button onClick={onRequestClose} className={styles.closeModalButton}>
          X
        </button>
      </div>
      <hr />
      <div className={styles.modalBody}>
        <div className={styles.inviteSection}>
          <div className={styles.inviteIconBack}>
            <img className={styles.inviteIcon} src={AddIcon} alt='초대장' />
          </div>
          <div className={styles.linkContainer}>
            <h2 className={styles.addFont}>초대링크 보내기</h2>
            <input
              type='text'
              value={link}
              readOnly
              className={styles.linkInput}
            />
            <button onClick={handleCopyLink} className={styles.copyButton}>
              복사
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCircle;
