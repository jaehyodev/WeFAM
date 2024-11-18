import React, { useState } from "react";
import ReactDOM from "react-dom";
import modalStyles from "../modal/Modal.module.css";
import styles from "./GameModal.module.css";
import roulette from "../../assets/images/roulette.png";
import ghostleg from "../../assets/images/ghostleg.png";

const GameModal = ({ onSaveRoulette, onClose, openRouletteModal }) => {
  const handleRouletteOpen = () => {
    openRouletteModal(); // 부모 컴포넌트에 룰렛 모달 열기 요청
    onClose(); // GameModal을 닫음
  };

  return ReactDOM.createPortal(
    <div className={modalStyles.modal} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.rouletteContainer}>
            <button className={styles.gameBtn} onClick={handleRouletteOpen}>
              <img className={styles.gameImg} src={roulette} alt="룰렛" />
            </button>
            <span>룰렛</span>
          </div>

          <div className={styles.ghostlegContainer}>
            <button className={styles.gameBtn}>
              <img className={styles.gameImg} src={ghostleg} alt="사다리타기" />
            </button>
            <span>사다리타기</span>
          </div>
        </div>
        {/* 모달 하단 버튼들 */}
        <div className={modalStyles.modalFooter}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default GameModal;
