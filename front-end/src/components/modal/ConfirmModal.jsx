import React from "react";
import "./Modal.module.css"; // 이미 작성한 CSS 파일 사용
import ReactDOM from "react-dom";

const ConfirmModal = ({ showModal, onClose, onConfirm }) => {
  if (!showModal) return null; // 모달이 열리지 않으면 렌더링하지 않음

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <div>
          <h3>구매 확인</h3>
          <span className="close-button" onClick={onClose}>
            &times;
          </span>

          <div>
            <p>정말로 구매하시겠습니까?</p>
          </div>
        </div>

        <div className="modalFooter">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button className="saveButton" onClick={onConfirm}>
            구매
          </button>
        </div>
      </div>
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default ConfirmModal;
