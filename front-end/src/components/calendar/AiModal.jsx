import React, { useState } from "react";
import styles from "../modal/Modal.module.css";
import style from "./AiModal.module.css";
import mountain from "../../assets/images/mountains.png";
import inside from "../../assets/images/inside.png";
import festival from "../../assets/images/festival.png";
import activity from "../../assets/images/gliding.png";
import Chatbot from "../chatbot/Chatbot"; // Chatbot 컴포넌트 임포트
import dot from "../../assets/images/dot11.png";
import { useSelector } from "react-redux";

const AiModal = ({ onClose, startDate, endDate, location, onSelectPlace }) => {
  const locationInput = useSelector(
    (state) => state.locationInput.locationInput
  ); // 리덕스 상태 가져오기
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Chatbot 모달 상태 관리

  const themes = [
    { id: 1, name: "산", image: mountain },
    { id: 2, name: "실내여행지", image: inside },
    { id: 3, name: "액티비티", image: activity },
    { id: 4, name: "축제", image: festival },
    { id: 5, name: "상관없음", image: dot },
  ];

  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);
  };

  const handleComplete = () => {
    if (selectedTheme) {
      setIsChatbotOpen(true); // 완료 버튼을 누르면 Chatbot 모달 열기
      console.log("입력받은 곳" + locationInput);
    } else {
      alert("테마를 선택해 주세요.");
    }
  };

  const handleClose = () => {
    onClose();
  };

  // 장소를 선택했을 때 Chatbot과 AiModal을 닫는 함수
  const handlePlaceSelectFromChatbot = (memoContent) => {
    onSelectPlace(memoContent); // 선택된 장소를 EventModal로 전달
    setIsChatbotOpen(false); // Chatbot 모달 닫기
    onClose(); // AiModal 닫기
  };

  const handleChatbotClose = () => {
    setIsChatbotOpen(false); // Chatbot 모달 닫기
  };

  return (
    <div className={styles.modal}>
      <div className={style.aimodal}>
        <div className={style.themeHead}>
          <h1>가족이 원하는 여행 테마를 1개 선택해 주세요.</h1>
        </div>
        <div className={style.themeContainer}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`${style.theme} ${
                selectedTheme?.id === theme.id ? style.selected : ""
              }`}
              onClick={() => handleThemeClick(theme)}>
              {theme.image && (
                <img
                  src={theme.image}
                  alt={theme.name}
                  className={style.themeImage}
                />
              )}
              {<div className={style.themeName}>{theme.name}</div>}
            </div>
          ))}
        </div>
        <div className={style.buttonContainer}>
          <button className={style.cancelButton} onClick={handleClose}>
            취소
          </button>
          <button className={style.completeButton} onClick={handleComplete}>
            완료
          </button>
        </div>
      </div>

      {/* Chatbot 모달 렌더링 */}
      {isChatbotOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* 선택된 테마, 날짜, 장소를 Chatbot 컴포넌트로 전달 */}
            <Chatbot
              onClose={handleChatbotClose}
              theme={selectedTheme.name}
              startDate={startDate}
              endDate={endDate}
              location={location || locationInput}
              onSelectPlace={handlePlaceSelectFromChatbot}
            />{" "}
            {/* 선택된 테마 전달 */}
            <button className={style.closeButton} onClick={handleChatbotClose}>
              챗봇 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiModal;
