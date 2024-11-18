import "../../css/Modal.css";
import React, { useState } from "react";

export const MemoModal = ({ onClose, initialContent, eventColor }) => {
  const [content, setContent] = useState(initialContent); // 초기 메모 내용을 상태로 관리

  // 메모 내용 변경 처리
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // 저장 버튼 클릭 시 모달을 닫고 메모 내용 전달
  const handleSaveClick = () => {
    if (onClose) {
      onClose(content); // 수정된 메모 내용을 상위 컴포넌트로 전달
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="title">
          <h2>메모</h2>
        </div>
        <div>
          <textarea
            className="textarea"
            placeholder="메모를 작성해주세요"
            value={content} // 메모 내용을 상태와 연결
            onChange={handleContentChange} // 입력 변경 시 상태 업데이트
          >
            {initialContent}
          </textarea>
        </div>
        <div className="modalFooter">
          <button
            className="saveButton"
            onClick={handleSaveClick}
            style={{ backgroundColor: eventColor }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
