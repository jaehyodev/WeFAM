import React from "react";
import styles from "./CustomToast.module.css"; // CSS 모듈 경로
import { CiCircleCheck } from "react-icons/ci";
import { BsTrash } from "react-icons/bs";

const CustomToast = ({ type, message, onClose }) => {
  const getIcon = () => {
    // 메시지가 '포인트가 부족합니다'일 경우 아이콘을 숨김
    if (message === "포인트가 부족합니다!") {
      return null; // 아이콘을 숨김
    }
    return type === "success" ? <CiCircleCheck /> : <BsTrash />;
  };

  const getTitle = () => {
    return type === "success" ? "성공" : "삭제";
  };

  return (
    <div className={`${styles.toastContainer} ${styles[type]}`}>
      <div className={`${styles.icon} ${styles[type]}`}>{getIcon()}</div>
      <div className={styles.message}>
        <strong className={styles[type]}>{getTitle()}</strong>
        <p>{message}</p>
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default CustomToast;
