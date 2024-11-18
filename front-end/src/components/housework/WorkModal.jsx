import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiList, FiEdit, FiUser, FiAlertCircle } from "react-icons/fi";
import { TbCoin } from "react-icons/tb";
import styles from "./WorkModal.module.css";
import modalPointIcon from "../../assets/images/modalPointIcon.png";

// 모달이 렌더링될 DOM 요소 설정
Modal.setAppElement("#root");

const WorkModal = ({
  isModalOpen, // 모달의 열림/닫힘 상태
  closeModal, // 모달을 닫는 함수
  taskType, // 작업 유형
  taskName, // 작업 이름
  taskContent, // 작업 내용
  taskPoint, // 작업 포인트
  warningMessages, // 경고 메시지들
  familyMembers, // 가족 구성원 목록
  handleTaskTypeChange, // 작업 유형 변경 핸들러
  handleTaskNameChange, // 작업 이름 변경 핸들러
  handleTaskContentChange, // 작업 내용 변경 핸들러
  handleTaskPointChange, // 작업 포인트 변경 핸들러
  addOrUpdateTask, // 작업 추가/수정 함수
  editTaskIndex, // 수정 중인 작업의 인덱스
  handleWorkUserChange, // 선택된 담당자 변경 핸들러
}) => {
  const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 담당자들
  const [availableMembers, setAvailableMembers] = useState(familyMembers); // 선택 가능한 담당자들
  const [isDropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 열림 상태

  // 모달이 닫힐 때 선택된 담당자 초기화
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedMembers([]);
    }
  }, [isModalOpen]);

  // selectedMembers 또는 familyMembers가 변경될 때마다 availableMembers를 업데이트합니다.
  useEffect(() => {
    setAvailableMembers(
      familyMembers.filter(
        (member) =>
          !selectedMembers.some(
            (selectedMember) => selectedMember.id === member.id
          )
      )
    );
  }, [selectedMembers, familyMembers]);

  // 선택된 담당자를 업데이트하고 부모 컴포넌트에 전달하는 함수
  useEffect(() => {
    handleWorkUserChange(selectedMembers);
  }, [selectedMembers, handleWorkUserChange]);

  // 담당자 선택 시 호출되는 함수
  const handleUserSelection = (member) => {
    if (member && !selectedMembers.some((user) => user.id === member.id)) {
      const updatedMembers = [...selectedMembers, member];
      setSelectedMembers(updatedMembers);
      setDropdownOpen(false); // 선택 후 드랍다운을 닫음

      // 선택된 멤버를 availableMembers에서 제거
      setAvailableMembers(
        familyMembers.filter(
          (m) => !updatedMembers.some((user) => user.id === m.id)
        )
      );
    }
  };

  // 선택된 담당자를 제거하는 함수
  const removeSelectedUser = (userId) => {
    const updatedMembers = selectedMembers.filter((user) => user.id !== userId);
    setSelectedMembers(updatedMembers);

    // 제거된 멤버를 availableMembers에 다시 추가
    setAvailableMembers(
      familyMembers.filter(
        (m) => !updatedMembers.some((user) => user.id === m.id)
      )
    );
  };

  return (
    <Modal
      isOpen={isModalOpen} // 모달 열림/닫힘 여부
      onRequestClose={closeModal} // 모달 닫기 요청 시 호출되는 함수
      contentLabel="집안일 추가" // 모달의 접근성 라벨
      className={styles.houseworkModal} // 모달의 CSS 클래스
      overlayClassName={styles.houseworkOverlay} // 모달 오버레이의 CSS 클래스
    >
      <h2>{editTaskIndex !== null ? "집안일 수정" : "집안일 추가"}</h2>

      {/* 작업 유형 선택 */}
      <div className={styles.inputContainer}>
        <FiList className={styles.icon} />
        <select value={taskType} onChange={handleTaskTypeChange}>
          <option value="daily">매일 할 일</option>
          <option value="shortTerm">오늘의 미션</option>
        </select>
      </div>

      {/* 작업 이름 입력 */}
      <div className={styles.inputContainer}>
        <FiEdit className={styles.icon} />
        <input
          type="text"
          placeholder="할 일"
          value={taskName}
          onChange={handleTaskNameChange}
        />
      </div>

      {/* 작업 담당자 선택 (일일 작업인 경우만 표시) */}
      {taskType === "daily" && (
        <div className={styles.inputContainer}>
          <FiUser className={styles.icon} />
          <div style={{ width: "100%" }}>
            <div
              className={styles.customSelect}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <div className={styles.selectBox}>
                {selectedMembers.length > 0
                  ? selectedMembers.map((user) => user.name).join(", ")
                  : "담당자 선택"}{" "}
                {/* 선택된 담당자가 없으면 기본 문구 표시 */}
                <span className={styles.arrow}></span>
              </div>
              {isDropdownOpen && (
                <ul className={styles.selectDropdown}>
                  {availableMembers.map((member) => (
                    <li
                      key={member.id}
                      onClick={() => handleUserSelection(member)}
                    >
                      {member.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.selectedUsers}>
              {selectedMembers.map((user) => (
                <div key={user.id} className={styles.selectedUser}>
                  {user.name}
                  <button onClick={() => removeSelectedUser(user.id)}>x</button>
                </div>
              ))}
            </div>
            {warningMessages?.workUser && (
              <p className={styles.warningMessage}>
                {warningMessages.workUser}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 작업 내용 입력 */}
      <div className={styles.inputContainer}>
        <FiAlertCircle className={styles.icon} />
        <input
          type="text"
          placeholder="유의사항"
          value={taskContent}
          onChange={handleTaskContentChange}
        />
      </div>

      {/* 작업 포인트 입력 */}
      <div className={styles.inputContainer}>
        <img src={modalPointIcon} className={styles.Imgicon} />
        <div style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="포인트(숫자만 적어주세요)"
            value={taskPoint}
            onChange={handleTaskPointChange}
          />
          {warningMessages?.taskPoint && (
            <p className={styles.warningMessage}>{warningMessages.taskPoint}</p>
          )}
        </div>
      </div>

      {/* 모달 버튼 (취소, 추가 또는 수정) */}
      <div className={styles.houseworkModalButtonContainer}>
        <button className={styles.houseworkCloseButton} onClick={closeModal}>
          취소
        </button>
        <button
          className={styles.houseworkModalButton}
          onClick={addOrUpdateTask}
        >
          {editTaskIndex !== null ? "수정 완료" : "추가"}
        </button>
      </div>
    </Modal>
  );
};

export default WorkModal;
