import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./AddRewardModal.module.css";
import { useDropzone } from "react-dropzone";
import { FiEdit } from "react-icons/fi";
import { TbCoin } from "react-icons/tb";
import modalPointIcon from "../../assets/images/modalPointIcon.png";


Modal.setAppElement("#root");

const AddRewardModal = ({
  isOpen,
  onRequestClose,
  onAddReward,
  selectedReward,
}) => {
  const [rewardName, setRewardName] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 모달이 열리거나 닫힐 때 상태 초기화 및 선택된 보상 데이터 설정
  useEffect(() => {
    if (!isOpen) {
      setRewardName("");
      setRewardPoints("");
      setSelectedFiles([]);
    } else if (selectedReward) {
      // 선택된 보상이 있을 경우 초기 값을 설정
      setRewardName(selectedReward.reward.rewardName);
      setRewardPoints(selectedReward.reward.rewardPoint);
      setSelectedFiles([
        {
          preview: selectedReward.imageBase64, // Base64 이미지 미리보기 사용
        },
      ]);
    }
  }, [isOpen, selectedReward]);

  // Dropzone 설정
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file), // 이미지 미리보기를 위해 URL 생성
          })
        )
      );
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleAddReward = () => {
    if (rewardName && rewardPoints) {
      onAddReward({
        rewardIdx: selectedReward ? selectedReward.reward.rewardIdx : null, // 수정 시 기존 ID 포함
        rewardName,
        rewardPoints: parseInt(rewardPoints, 10),
        image: selectedFiles.length > 0 ? selectedFiles[0] : null, // 새 이미지가 없으면 null
      });
      onRequestClose(); // 모달 닫기 (상태 초기화는 useEffect에서 처리됨)
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="보상 추가 또는 수정"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalHeader}>
        <h2>{selectedReward ? "보상 수정" : "보상 추가"}</h2>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.inputGroup}>
          <FiEdit className={styles.icon} />
          <input
            type="text"
            value={rewardName}
            onChange={(e) => setRewardName(e.target.value)}
            placeholder="보상 이름"
            className={styles.inputField}
            maxLength={16} // 16글자 제한 설정
          />
        </div>

        <div className={styles.inputGroup}>
          <img src={modalPointIcon} className={styles.Imgicon} />
          <input
            type="number"
            value={rewardPoints}
            onChange={(e) => setRewardPoints(e.target.value)}
            placeholder="필요한 포인트"
            className={styles.inputField}
          />
        </div>

        {/* 드롭존 */}
        <div {...getRootProps({ className: styles.dropzone })} onClick={open}>
          <input {...getInputProps()} />
          {selectedFiles.length === 0 ? (
            <p className={styles.dropzoneText}>
              여기를 클릭하거나 이미지를 드롭하여 업로드하세요.
            </p>
          ) : (
            <div className={styles.previewContainer}>
              <img
                src={selectedFiles[0].preview}
                alt="Preview"
                className={styles.previewImage}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button onClick={onRequestClose} className={styles.cancelButton}>
          취소
        </button>
        <button onClick={handleAddReward} className={styles.addButton}>
          {selectedReward ? "수정" : "추가"}
        </button>
      </div>
    </Modal>
  );
};

export default AddRewardModal;
