import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import modalStyles from "../modal/Modal.module.css";
import styles from "./FeedDetailModal.module.css";
import Preloader from "../preloader/Preloader";
import { CiImageOn } from "react-icons/ci";
import { CiImageOff } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const FeedEditModal = ({ feed, onClose, onSave }) => {
  // 부모 FeedItem에서 Feed는 받아지는 것을 확인 (feed 안에는 idx가 있음).
  // idx를 통해 db에서 피드 데이터 가져오기.
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [writerProfileImg, setWriterProfileImg] = useState("");
  const [writerNick, setWriterNick] = useState("");
  const [feedContent, setFeedContent] = useState("");

  // 현재 슬라이드 번호와 전체 슬라이드 수
  const currentSlideNumber = currentSlide + 1;
  const totalSlides = imagePreview.length;

  useEffect(() => {
    const fetchImages = async () => {
      if (!feed || !feed.idx) {
        console.warn("Invalid feed or feed.idx");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/get-feed-img/${feed.idx}`
        );
        const images = response.data.map(
          (image) => `data:image/jpeg;base64,${image.fileData}`
        );
        setImagePreview(images);
      } catch (error) {
        console.error("클릭된 피드의 이미지 요청 에러:", error);
      }
    };

    const fetchData = async () => {
      if (!feed || !feed.idx) {
        console.warn("Invalid feed or feed.idx");
        return;
      }

      try {
        const feedResponse = await axios.get(
          `http://localhost:8089/wefam/get-feed-detail/${feed.idx}`
        );
        setWriterProfileImg(feedResponse.data.profileImg);
        setWriterNick(feedResponse.data.nick);
        setFeedContent(feedResponse.data.feedContent);
      } catch (error) {
        console.error("수정할 피드의 데이터 요청 에러 :", error);
      }
    };

    Promise.all([fetchImages(), fetchData()]).then(() => {
      setIsLoading(false); // 모든 비동기 작업 완료 후 로딩 상태를 false로 변경
    });
  }, [feed.idx]);

  const handlePrevSlide = (e) => {
    e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
    setCurrentSlide((prev) => Math.min(prev + 1, imagePreview.length - 1));
  };

  // 저장 버튼 클릭하면 feed.idx와 content를 서버로 보내어 피드 업데이트.
  const handleSaveClick = () => {
    onSave(feed.idx, feedContent);
    onClose();
  };

  // 로딩 상태에 따라 렌더링
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
            <div className={styles.preview}>
              {imagePreview.length > 0 ? (
                <>
                  {currentSlide > 0 && (
                    <div
                      className={styles.leftArrowBtn}
                      onClick={handlePrevSlide}
                    >
                      <MdKeyboardArrowLeft />
                    </div>
                  )}
                  <img
                    src={imagePreview[currentSlide]}
                    alt={`preview-${currentSlide}`}
                  />
                  {currentSlide < imagePreview.length - 1 && (
                    <div
                      className={styles.rightArrowBtn}
                      onClick={handleNextSlide}
                    >
                      <MdKeyboardArrowRight />
                    </div>
                  )}
                  {/* 현재 이미지 번호와 전체 이미지 번호 표시 */}
                  <div className={styles.slideNumber}>
                    {currentSlideNumber} / {totalSlides}
                  </div>
                </>
              ) : (
                <CiImageOff />
              )}
            </div>

            {/* 텍스트 내용 */}
            <div className={styles.contentContainer}>
              <div className={styles.profileContainer}>
                <div className={styles.profileImg}>
                  <img src={writerProfileImg} alt="" />
                </div>
                <div className={styles.profileNickLocation}>
                  <div className={styles.profileNick}>{writerNick}</div>
                  <div className={styles.location}></div>
                </div>
              </div>
              {/* 사용자 */}
              <textarea
                className={styles.content}
                name="feedContent"
                value={feedContent}
                onChange={(e) => setFeedContent(e.target.value)}
              ></textarea>
            </div>
          </div>
          {/* 푸터 */}
          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button
              className={modalStyles.saveButton}
              onClick={handleSaveClick}
            >
              수정
            </button>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default FeedEditModal;
