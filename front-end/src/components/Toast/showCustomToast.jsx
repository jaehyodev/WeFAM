import React from "react";
import { createRoot } from "react-dom/client";
import CustomToast from "./CustomToast";

// 토스트 메시지 생성 함수 (top, left 고정)
const showCustomToast = (message, type = "success") => {
  const toastContainer = document.createElement("div");
  document.body.appendChild(toastContainer);

  // createRoot로 root 생성
  const root = createRoot(toastContainer);

  const onClose = () => {
    root.unmount(); // 리액트 루트 언마운트

    // 부모 노드가 toastContainer를 포함하고 있는지 확인 후 제거
    if (toastContainer && toastContainer.parentNode) {
      toastContainer.parentNode.removeChild(toastContainer); // 토스트 요소 제거
    }
  };

  // 토스트 렌더링
  root.render(<CustomToast type={type} message={message} onClose={onClose} />);

  // 위치 고정
  toastContainer.style.position = "fixed";
  toastContainer.style.top = "100px"; // 고정된 위치
  toastContainer.style.left = "50%"; // 화면의 50%로 설정
  toastContainer.style.transform = "translateX(-50%)"; // 가운데 정렬
  toastContainer.style.zIndex = 9999; // zIndex 조정

  // 3초 후 자동으로 닫힘
  setTimeout(onClose, 3000);
};

// 성공 토스트 함수
export const toastSuccess = (message) => {
  showCustomToast(message, "success");
};

// 에러 토스트 함수
export const toastDelete = (message) => {
  showCustomToast(message, "error");
};
