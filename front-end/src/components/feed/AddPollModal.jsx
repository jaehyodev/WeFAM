import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./AddPollModal.module.css";
import Preloader from "../preloader/Preloader";
import { addPoll } from "../../features/pollsSlice";
import { BsPlusCircle } from "react-icons/bs";

// PollOptionDto 객체를 생성하는 함수
const createPollOptionDto = (optionContent, index) => ({
  pollOptionIdx: index + 1, // 또는 다른 고유 인덱스
  pollOptionContent: optionContent,
});

const PollModal = ({ onSavePoll, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(""); // 투표 제목
  const [options, setOptions] = useState(["", ""]); // 투표 항목 기본 2개, 최대 6개

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);

  // 투표 항목 추가
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  // 투표 항목 삭제
  const deleteOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // 투표 항목 변경 핸들러
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // 저장 버튼
  const onSave = async () => {
    setIsLoading(true);

    // PollOptionDto 객체 배열 생성
    const pollOptionsDto = options
      .filter((option) => option.trim() !== "")
      .map((option, index) => createPollOptionDto(option, index));

    // 새로운 투표 객체 생성
    const newPoll = {
      id: Date.now(), // 고유한 ID를 생성하기 위해 현재 시간을 사용
      userId: userData.id,
      pollTitle: title,
      pollOptions: pollOptionsDto, // PollOptionDto 배열로 설정
    };
    console.log("newPoll", newPoll);
    // 투표 데이터를 Redux에 저장
    dispatch(addPoll(newPoll));

    setIsLoading(false);

    // 투표 데이터를 AddFeed에 전달
    onSavePoll(newPoll);

    onClose();
  };

  return ReactDOM.createPortal(
    isLoading ? (
      <div className={modalStyles.modal}>
        <Preloader isLoading={isLoading} />
      </div>
    ) : (
      <div className={modalStyles.modal} onClick={onClose}>
        <div
          className={modalStyles["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.main}>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputTitle}
            />
            <div className={styles.optionsContainer}>
              {options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <input
                    type="text"
                    placeholder={`투표 항목 ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={styles.inputOption}
                  />
                  <button
                    onClick={() => deleteOption(index)}
                    className={`${styles.deleteOptionBtn} ${
                      options.length <= 2 ? styles.disabled : styles.abled
                    }`} // 길이가 2 이하일 때 .disabled 클래스 추가
                    disabled={options.length <= 2} // 길이가 2 이하일 때 버튼 비활성화
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button onClick={addOption} className={styles.addOptionBtn}>
                <BsPlusCircle /> &nbsp; 항목 추가
              </button>
            )}

            {/* 푸터 */}
            <div className={modalStyles.modalFooter}>
              <button className={modalStyles.cancelButton} onClick={onClose}>
                취소
              </button>
              <button className={modalStyles.saveButton} onClick={onSave}>
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default PollModal;
