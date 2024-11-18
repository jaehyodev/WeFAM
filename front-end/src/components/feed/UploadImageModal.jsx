import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./UploadImageModal.module.css";
import { useSelector } from "react-redux";
import { CiImageOn } from "react-icons/ci";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import Preloader from "../preloader/Preloader";

const UploadImageModal = ({
  content,
  onClose,
  onGetJoiningData,
  onGetAllFeeds,
  currentPage,
  setCurrentPage,
  onResetContent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalContent, setModalContent] = useState("");
  const [location, setLocation] = useState("");

  const maxImageCnt = 9;

  // content 프롭스가 변경될 때마다 상태를 업데이트
  useEffect(() => {
    setModalContent(content || "");
  }, [content]);

  // 이미지 미리보기 함수
  const showPreview = (selectedImages) => {
    if (selectedImages.length > maxImageCnt) {
      alert("이미지는 최대 9개까지 업로드 가능합니다!");
      return;
    }

    const imageUrls = selectedImages.map((image) => URL.createObjectURL(image));
    setImagePreview(imageUrls);
  };

  // Drag & Drop 핸들러
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    setImages(droppedFiles);
    showPreview(droppedFiles); // Preview 함수에 파일 리스트 전달
  }, []);

  // 파일 선택 핸들러
  const onFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages(newFiles); // 선택된 파일을 상태에 설정
    showPreview(newFiles); // Preview 함수에 파일 리스트 전달
  };

  // 이미지가 선택되었을 때 콘솔에 몇 개가 선택되었는지 출력
  useEffect(() => {
    console.log(`${images.length}개의 이미지가 선택되었습니다.`);
  }, [images]);

  // 취소 버튼
  const handleCancel = () => {
    setImages([]);
    setImagePreview([]);
    onClose();
  };

  // 이미지 저장 버튼
  const onSave = async () => {
    setIsLoading(true);

    if (images.length > 0) {
      // 이미지가 있는 경우
      const formData = new FormData();
      formData.append("familyIdx", userData.familyIdx);
      formData.append("userId", userData.id);
      formData.append("entityType", "feed");
      formData.append("entityIdx", 0); // 우선 feed 저장 전 테스트용
      formData.append("feedContent", modalContent);
      formData.append("feedLocation", location);

      images.forEach((file) => {
        formData.append("images", file);
        formData.append("fileNames", file.name);
        formData.append("fileExtensions", file.name.split(".").pop());
        formData.append("fileSizes", file.size);
      });

      try {
        const response = await fetch(
          "http://localhost:8089/wefam/add-feed-img",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("서버 응답:", result);
        } else {
          console.error("서버 오류:", response.statusText);
        }
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    } else {
      // 이미지가 없는 경우
      const newFeed = {
        familyIdx: userData.familyIdx,
        userId: userData.id,
        feedContent: modalContent,
        feedLocation: location,
      };

      try {
        const response = await fetch("http://localhost:8089/wefam/add-feed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFeed),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("서버 응답:", result);
        } else {
          console.error("서버 오류:", response.statusText);
        }
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    }

    try {
      if (userData.familyIdx) {
        setCurrentPage(1);
        await onGetAllFeeds(1);
      }
    } catch (error) {
      console.error("피드를 가져오는 중 오류 발생:", error);
    } finally {
      onResetContent();
      setIsLoading(false);
      onClose();
    }
  };

  // 슬라이드 이전으로 이동
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  // 슬라이드 다음으로 이동
  const handleNextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, imagePreview.length - 1));
  };

  const dropzoneClassName = `${styles.dropzone} ${
    dragging ? styles.dragging : ""
  }`;

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
            {/* 이미지 프리뷰 */}
            {imagePreview.length > 0 ? (
              <div className={styles.preview}>
                {currentSlide > 0 && (
                  <div className={styles.leftArrow} onClick={handlePrevSlide}>
                    <MdKeyboardArrowLeft />
                  </div>
                )}
                <img
                  src={imagePreview[currentSlide]}
                  alt={`preview-${currentSlide}`}
                />
                {currentSlide < imagePreview.length - 1 && (
                  <div className={styles.rightArrow} onClick={handleNextSlide}>
                    <MdKeyboardArrowRight />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={dropzoneClassName}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={styles.dropzoneIcon}>
                  <CiImageOn />
                </div>
                <div className={styles.dropzoneText}>
                  사진을 여기에 끌어다 놓으세요!
                </div>
                <div className={styles.dropzoneBtn}>
                  <label htmlFor="file">컴퓨터에서 선택</label>
                  <input
                    type="file"
                    id="file"
                    multiple
                    onChange={onFileChange}
                  />
                </div>
              </div>
            )}

            {/* 텍스트 내용 */}
            <div className={styles.addFeed}>
              <div className={styles.profileContainer}>
                <div className={styles.profileImg}>
                  <img src={userData.profileImg} alt="" />
                </div>
                <div className={styles.profileNick}>{userData.nick}</div>
              </div>
              <textarea
                className={styles.content}
                placeholder="무슨 생각을 하고 계신가요?"
                name="modalContent"
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
              >
                내용입니다.
              </textarea>
            </div>
          </div>

          {/* 푸터 */}
          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={handleCancel}>
              취소
            </button>
            <button className={modalStyles.saveButton} onClick={onSave}>
              등록
            </button>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default UploadImageModal;
