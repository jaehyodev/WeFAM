import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import styles from "./AddFeed.module.css";
import UploadImageModal from "./UploadImageModal";
import GameModal from "./GameModal";
import AddPollModal from "./AddPollModal";
import { PiArrowBendDownLeft } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { CiSquareCheck } from "react-icons/ci";
import { PiGameControllerLight } from "react-icons/pi";
import { clearImages } from "../../features/imagesOnFeedSlice";
import { deleteRoulette, clearRoulettes } from "../../features/roulettesSlice";
import { deletePoll, clearPolls } from "../../features/pollsSlice";
import Preloader from "../preloader/Preloader";
import AddRouletteModal from "./AddRouletteModal";
import { ToastContainer, toast } from "react-toastify";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const AddFeed = React.memo(({ onGetAllFeeds, currentPage, setCurrentPage }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isRouletteModalOpen, setIsRouletteModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const maxImgCnt = 9;
  const perImgCnt = 3;
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [roulettes, setRoulettes] = useState([]); // 룰렛 데이터 상태
  const [polls, setPolls] = useState([]); // 투표 데이터 상태

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);
  const roulettesData = useSelector((state) => state.roulettes.roulettes) || [];
  const pollsData = useSelector((state) => state.polls.polls) || [];

  const dispatch = useDispatch();
  // const images = useSelector((state) => state.imagesOnFeed.images);
  // console.log("images : ", images);

  useEffect(() => {
    // 페이지 로드 시 이미지 상태를 초기화
    // dispatch(clearImages());
    dispatch(clearRoulettes()); // 페이지 로드 시 polls 상태를 초기화
    dispatch(clearPolls()); // 페이지 로드 시 polls 상태를 초기화
  }, [dispatch]);

  useEffect(() => {
    setRoulettes(roulettesData); // Redux에서 가져온 roulettes를 상태에 설정
    setPolls(pollsData); // Redux에서 가져온 polls를 상태에 설정
  }, [roulettesData, pollsData]);

  // const handlePrev = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   }
  // };

  // const handleNext = () => {
  //   if (currentIndex + 5 < images.length) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };

  // 새로운 피드 작성 함수
  const addFeed = useCallback(
    async (newFeed) => {
      try {
        console.log("addFeed 함수 실행 ");
        setIsLoading(true);
        await axios.post("http://localhost:8089/wefam/add-feed", newFeed, {
          headers: {
            "Content-Type": "application/json", // 서버가 JSON 형식을 기대할 경우
          },
        });
        setContent("");
        toastSuccess("피드가 성공적으로 등록되었습니다!");
        await onGetAllFeeds(1);
      } catch (error) {
        console.error("addFeed 함수 에러 : ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData.familyIdx, onGetAllFeeds]
  );

  const handleAddFeed = async () => {
    if (content.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }

    try {
      // 이미지가 있는 경우
      if (images.length > 0) {
        const formData = new FormData();
        formData.append("familyIdx", userData.familyIdx);
        formData.append("userId", userData.id);
        formData.append("entityType", "feed");
        formData.append("entityIdx", 0); // 우선 feed 저장 전 테스트용
        formData.append("feedContent", content);
        formData.append("feedLocation", location);

        images.forEach((file) => {
          formData.append("images", file);
          formData.append("fileNames", file.name);
          formData.append("fileExtensions", file.name.split(".").pop());
          formData.append("fileSizes", file.size);
        });

        if (roulettes.length > 0) {
          // 'id' 필드 제거
          const filteredRoulettes = roulettes.map(({ id, ...rest }) => rest);
          const roulettesJson = JSON.stringify(filteredRoulettes);
          formData.append("roulettesJson", roulettesJson);
        }

        if (polls.length > 0) {
          const filteredPolls = polls.map(({ id, ...rest }) => rest);
          const pollsJson = JSON.stringify(filteredPolls);
          formData.append("pollsJson", pollsJson);
        }

        const response = await fetch("http://localhost:8089/wefam/api/feeds", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            // 'Content-Type': 'multipart/form-data'는 자동으로 설정됩니다.
          },
        });

        if (response.ok) {
          setContent("");
          toastSuccess("피드가 성공적으로 등록되었습니다!");
          setCurrentPage(1);
          await onGetAllFeeds(1);
          const text = await response.text();
        } else {
          console.error("서버 오류:", response.statusText);
        }
        // 이미지가 없는 경우
      } else {
        const newFeed = {
          familyIdx: userData.familyIdx,
          userId: userData.id,
          feedContent: content,
          feedLocation: location,
        };

        if (roulettes.length > 0) {
          newFeed.roulettes = roulettes;
        }
        if (polls.length > 0) {
          newFeed.polls = polls;
        }

        await addFeed(newFeed);
      }

      setContent("");
      setLocation("");
      setImages([]);
      setImagePreview([]);
      setRoulettes([]);
      dispatch(clearRoulettes());
      setPolls([]);
      dispatch(clearPolls());
    } catch (error) {
      console.error("AddFeed 함수에서 오류 발생:", error);
    }
  };

  // 이미지 미리보기 함수
  // const showPreview = (selectedImages) => {
  //   const totalImages = images.length + selectedImages.length;
  //   if (totalImages > maxImgCnt) {
  //     alert(`이미지는 최대 ${maxImgCnt}개까지 업로드 가능합니다!`);
  //     return;
  //   }

  //   const imageUrls = selectedImages.map((image) => URL.createObjectURL(image));
  //   setImagePreview((prev) => [...prev, ...imageUrls]);
  // };

  // 파일 선택 핸들러
  const onFileChange = (event) => {
    // 파일 검증 (예: 이미지 파일만 허용)
    const validFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );

    // 기존 이미지 목록과 드롭된 파일을 결합하여 상태 업데이트
    setImages((prevImages) => [...prevImages, ...validFiles]);

    setImagePreview((prevPreviews) => {
      // 기존 미리보기 URL과 새로 생성된 미리보기 URL을 결합
      const newPreviews = validFiles.map((file) => {
        const url = URL.createObjectURL(file);
        return url;
      });
      return [...prevPreviews, ...newPreviews];
    });
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
    console.log("드랍 완료");
    const droppedFiles = Array.from(event.dataTransfer.files);

    // 파일 검증 (예: 이미지 파일만 허용)
    const validFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    // 기존 이미지 목록과 드롭된 파일을 결합하여 상태 업데이트
    setImages((prevImages) => [...prevImages, ...validFiles]);

    setImagePreview((prevPreviews) => {
      // 기존 미리보기 URL과 새로 생성된 미리보기 URL을 결합
      const newPreviews = validFiles.map((file) => {
        const url = URL.createObjectURL(file);
        return url;
      });
      return [...prevPreviews, ...newPreviews];
    });

    // 파일이 드롭되었을 때 입력 창 초기화 방지
    event.dataTransfer.clearData();
    setDragging(false);
  }, []);

  const handlePrevSlide = (e) => {
    e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
    setCurrentSlide((prev) =>
      Math.min(prev + 1, Math.ceil(Math.min(images.length, 9) / 3) - 1)
    );
  };

  const handleDeleteImage = (index) => {
    setImagePreview((prevImages) => {
      // FileList를 배열로 변환
      const imagesArray = Array.from(prevImages);

      // 필터링하여 이미지를 제거
      const updatedImages = imagesArray.filter((_, i) => i !== index);

      // 상태 업데이트
      setImagePreview(updatedImages);

      // DB에 업로드할 이미지 배열도 업데이트
      setImages((prevImages) => {
        const imagesArray = Array.from(prevImages);
        return imagesArray.filter((_, i) => i !== index);
      });

      // 총 슬라이드 수 조정
      const totalSlides = Math.ceil(updatedImages.length / perImgCnt);

      // 현재 슬라이드 조정: 이미지를 모두 지우면 currentSlide는 0으로, 그 외에는 현재 슬라이드를 유지
      const newSlide =
        totalSlides > 0 ? Math.min(currentSlide, totalSlides - 1) : 0;
      console.log("현재슬라이드 번호 : ", newSlide);

      setCurrentSlide(newSlide);

      return updatedImages;
    });
  };

  const dropzoneClassName = `${styles.dropzone} ${
    dragging ? styles.dragging : ""
  }`;

  const openRouletteModal = () => setIsRouletteModalOpen(true);

  // RouletteModal에서 저장된 Roulette 데이터를 받아서 상태에 저장
  const handleSaveRoulette = (rouletteData) => {
    setRoulettes([...roulettes, rouletteData]);
  };

  const handleDeleteRoulette = (rouletteId) => {
    dispatch(deleteRoulette({ rouletteId }));
  };

  // PollModal에서 저장된 투표 데이터를 받아서 상태에 저장
  const handlePollSave = (pollData) => {
    setPolls([...polls, pollData]);
  };

  const handleDeletePoll = (pollId) => {
    dispatch(deletePoll({ pollId }));
  };

  // 업로드이미지모달에서 피드 add 후에 content 빈값 처리
  const handleResetContent = () => {
    setContent("");
  };

  // 현재 슬라이드 번호와 전체 슬라이드 수
  const currentSlideNumber = currentSlide + 1;
  const totalSlides = Math.ceil(Math.min(images.length, 9) / 3);

  return (
    <div
      className={`${styles.addFeed}  ${dropzoneClassName}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <Preloader isLoading={isLoading} />
      ) : (
        <>
          <textarea
            className={styles.content}
            placeholder="무슨 생각을 하고 계신가요?"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className={styles.specialContent}>
            {roulettes.length > 0 &&
              roulettes.map((roulette, index) => (
                <div key={index} className={styles.roulette}>
                  <button>
                    <PiGameControllerLight />
                    <span>{roulette.rouletteTitle}</span>
                  </button>
                  <button
                    className={styles.rouletteDeleteBtn}
                    onClick={() => handleDeleteRoulette(roulette.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            {polls.length > 0 &&
              polls.map((poll, index) => (
                <div key={index} className={styles.poll}>
                  <button>
                    <CiSquareCheck />
                    <span>{poll.pollTitle}</span>
                  </button>
                  <button
                    className={styles.pollDeleteBtn}
                    onClick={() => handleDeletePoll(poll.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>

          {/* 이미지 슬라이더 추가 */}
          {imagePreview.length > 0 && <hr className={styles.customHr}></hr>}

          {imagePreview.length > 0 && (
            <div className={styles.imageSlider}>
              <div className={styles.imagesContainer}>
                <button
                  className={`${styles.leftArrowBtn} ${
                    currentSlide === 0 ? styles.hidden : ""
                  }`}
                  onClick={handlePrevSlide}
                >
                  <MdKeyboardArrowLeft />
                </button>
                <div className={styles.preview}>
                  {imagePreview
                    .slice(
                      currentSlide * perImgCnt,
                      (currentSlide + 1) * perImgCnt
                    )
                    .slice(0, maxImgCnt) // 최대 9개의 이미지만 표시
                    .map((imageUrl, index) => (
                      <div key={index} className={styles.imageWrapper}>
                        <img
                          src={imageUrl} // imageUrl을 직접 img src에 할당
                          alt={`preview-${index}`} // currentSlide 대신 index 사용
                        />
                        {/* X 버튼 추가 */}
                        <button
                          className={styles.deleteImageBtn}
                          onClick={() => handleDeleteImage(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                </div>
                <button
                  className={`${styles.rightArrowBtn} ${
                    currentSlide >=
                    Math.ceil(Math.min(images.length, maxImgCnt) / perImgCnt) -
                      1
                      ? styles.hidden
                      : ""
                  }`}
                  onClick={handleNextSlide}
                >
                  <MdKeyboardArrowRight />
                </button>
              </div>

              {/* 현재 이미지 번호와 전체 이미지 번호 표시 */}
              <div
                className={`${styles.slideNumber} ${
                  totalSlides === 1 ? styles.hidden : ""
                }`}
              >
                {totalSlides > 1 && `${currentSlideNumber} / ${totalSlides}`}
              </div>
            </div>
          )}
          <hr className={styles.customHr}></hr>
          <div className={styles.footer}>
            <span>
              {/* 파일 선택 방식 사용 */}
              {/* <button onClick={() => setIsUploadImageModalOpen(true)}> */}
              <button>
                <label className={styles.selectLabel} htmlFor="file">
                  <CiImageOn />
                </label>
                <input
                  className={styles.selectInput}
                  type="file"
                  id="file"
                  multiple
                  onChange={onFileChange}
                />
              </button>
              {/* </button> */}
              <button>
                <CiCalendar />
              </button>
              <button onClick={() => setIsGameModalOpen(true)}>
                <PiGameControllerLight />
              </button>
              <button onClick={() => setIsPollModalOpen(true)}>
                <CiSquareCheck />
              </button>
            </span>
            <span>
              <button className={styles.addFeedBtn} onClick={handleAddFeed}>
                <PiArrowBendDownLeft />
              </button>
            </span>
          </div>
          {isUploadImageModalOpen && (
            <UploadImageModal
              content={content}
              onHandleAddFeed={handleAddFeed}
              onGetAllFeeds={onGetAllFeeds}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onResetContent={handleResetContent}
              onClose={() => setIsUploadImageModalOpen(false)}
            />
          )}
          {isGameModalOpen && (
            <GameModal
              onSaveRoulette={handleSaveRoulette}
              openRouletteModal={openRouletteModal}
              onClose={() => setIsGameModalOpen(false)}
            />
          )}
          {isRouletteModalOpen && (
            <AddRouletteModal
              onSaveRoulette={handleSaveRoulette}
              onClose={() => setIsRouletteModalOpen(false)}
            />
          )}
          {isPollModalOpen && (
            <AddPollModal
              onSavePoll={handlePollSave}
              onClose={() => setIsPollModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
});

export default AddFeed;
