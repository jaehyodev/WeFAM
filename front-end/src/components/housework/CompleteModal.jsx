import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux"; // Redux에서 사용자 정보를 가져오기 위한 import
import styles from "./CompleteModal.module.css";
import modalStyles from "../modal/Modal.module.css";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";

Modal.setAppElement("#root");

const CompleteModal = ({
  isOpen,
  onRequestClose,
  taskName,
  onComplete,
  selectedTask,
}) => {
  const userId = useSelector((state) => state.user.userData.id); // Redux에서 userId를 가져옴
  const familyIdx = useSelector((state) => state.user.userData.familyIdx); // Redux에서 familyIdx를 가져옴
  const [selectedFiles, setSelectedFiles] = useState([]); // 파일을 저장할 상태

  // 파일이 드롭되거나 선택될 때 호출되는 함수
  const onDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  // 모달이 열릴 때마다 파일 상태를 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]); // 모달이 열릴 때 selectedFiles를 초기화
    }
  }, [isOpen]);

  // react-dropzone 설정
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = (fileName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  // 이미지 및 작업 완료 정보 전송
  const handleCompleteConfirm = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("images", file);
      formData.append("fileNames", file.name);
      formData.append("fileExtensions", file.name.split(".").pop());
      formData.append("fileSizes", file.size);
    });

    formData.append("familyIdx", familyIdx); // familyIdx 설정
    formData.append("userId", userId); // userId 설정
    formData.append("entityType", selectedTask.taskType); // taskType을 entityType으로 전송
    formData.append("entityIdx", selectedTask.workIdx); // 선택된 작업의 workIdx를 entityIdx로 사용
    formData.append("completed", true); // 작업 완료 여부

    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/complete-with-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toastSuccess("집안일이 성공적으로 완료되었습니다!");
        onComplete(); // 완료 후 호출
      } else {
        console.error("Failed to complete task:", response);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="미션 완료"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalBody}>
        <h2>미션 완료</h2>
        <p>"{taskName}"을(를) 완료하셨습니까?</p>

        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          {selectedFiles.length === 0 ? (
            <p onClick={open} style={{ cursor: "pointer" }}>
              여기를 클릭하거나 이미지를 드롭하여 업로드하세요.
            </p>
          ) : (
            <div className={styles.previewArea}>
              <img
                src={URL.createObjectURL(selectedFiles[0])}
                alt={selectedFiles[0].name}
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        <ul className={styles.fileList}>
          {selectedFiles.map((file) => (
            <li key={file.name} className={styles.fileItem}>
              {file.name}
              <button
                onClick={() => removeFile(file.name)}
                className={styles.removeFileButton}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.buttonContainer}>
          <p>확인용 이미지를 등록해주세요!</p>
          <button
            className={styles.confirmButton}
            onClick={handleCompleteConfirm}
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteModal;
