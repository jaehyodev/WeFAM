import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import styles from "./AlbumFolder.module.css";
import axios from "axios";
import { BsPlusCircle } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";
import albumIcon from "../../assets/images/icon-album.png";
import Preloader from "../preloader/Preloader";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

Modal.setAppElement("#root");

const AlbumFolder = () => {
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state) => state.user.userData.id);
  const userData = useSelector((state) => state.user.userData);

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const imagesPerPage = 12;

  // 초기 이미지 불러오기
  useEffect(() => {
    fetchImages();
  }, []);

  // 이미지 조회 함수
  const fetchImages = (start = "", end = "") => {
    setIsLoading(true);
    const effectiveEndDate = end || new Date().toISOString().split("T")[0];

    const url = start
      ? `http://localhost:8089/wefam/get-album-images-by-date-range/${userData.familyIdx}/${start}/${effectiveEndDate}`
      : `http://localhost:8089/wefam/get-album-images/${userData.familyIdx}`;

    axios
      .get(url)
      .then((response) => {
        if (response.data.length === 0) {
          alert("해당 기간에 이미지가 없습니다.");
          setImages([]);
        } else {
          const fetchedImages = response.data.map((image) => ({
            id: image.fileIdx,
            url: `data:image/${image.fileExtension};base64,${image.fileData}`,
          }));
          setImages(fetchedImages.reverse());
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("이미지를 불러오는 중 오류 발생:", error);
        setIsLoading(false);
      });
  };

  // 페이지네이션 처리
  const handleNextPage = () => {
    if ((currentPage + 1) * imagesPerPage < images.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  // react-dropzone 설정
  const onDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setCurrentImageIndex(0);
  };

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

  // 이미지 저장
  const saveImages = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("images", file);
      formData.append("fileNames", file.name);
      formData.append("fileExtensions", file.name.split(".").pop());
      formData.append("fileSizes", file.size);
    });

    formData.append("familyIdx", userData.familyIdx);
    formData.append("userId", userId);
    formData.append("entityType", "album");
    formData.append("entityIdx", 0);

    try {
      const response = await axios.post(
        "http://localhost:8089/wefam/add-album-img",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("이미지 저장이 완료되었습니다.");
        window.location.reload();
      } else {
        console.error("이미지 저장 실패:", response);
      }
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
    }
  };

  // 이미지 삭제
  const deleteSelectedImages = () => {
    axios
      .delete("http://localhost:8089/wefam/delete-album-images", {
        data: selectedImages,
      })
      .then((response) => {
        alert("이미지가 성공적으로 삭제되었습니다.");
        setImages(images.filter((image) => !selectedImages.includes(image.id)));
        setSelectedImages([]);
      })
      .catch((error) => {
        console.error("이미지 삭제 중 오류 발생:", error);
      });
  };

  // 날짜 선택 핸들러
  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) =>
    setEndDate(event.target.value || new Date().toISOString().split("T")[0]);

  // 이미지 선택 처리
  const toggleImageSelection = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleAllImages = (event) => {
    setSelectedImages(
      event.target.checked ? images.map((image) => image.id) : []
    );
  };

  const openImageModal = (index) => {
    const totalIndex = currentPage * imagesPerPage + index;
    setCurrentImageIndex(totalIndex);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => setIsImageModalOpen(false);

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showNextFile = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedFiles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousFile = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedFiles.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="main">
      {isLoading ? (
        <Preloader isLoading={isLoading} />
      ) : (
        <div className={styles.album}>
          <div className={styles.header}>
            <div className={styles.title}>
              <div>
                <img src={albumIcon} alt="" />
              </div>
              <h1>가족 앨범</h1>
            </div>
            <div className={styles.controller}>
              <div className={styles.selectController}>
                <p>시작일</p>
                <input
                  className={styles.dateInput}
                  type="date"
                  onChange={handleStartDateChange}
                  value={startDate}
                />
                <p>종료일</p>
                <input
                  className={styles.dateInput}
                  type="date"
                  onChange={handleEndDateChange}
                  value={endDate}
                />
                <button
                  className={styles.selectBtn}
                  onClick={() => fetchImages(startDate, endDate)}
                >
                  조회
                </button>
                <button
                  className={styles.resetBtn}
                  onClick={() => fetchImages()}
                >
                  초기화
                </button>
              </div>
              <div className={styles.manageController}>
                <button
                  className={styles.btnDelete}
                  onClick={deleteSelectedImages}
                >
                  <BsTrash />
                </button>
                <button
                  className={styles.btnPlus}
                  onClick={() => setIsModalOpen(true)}
                >
                  <BsPlusCircle />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.folderContainer}>
            <div className={styles.selectAllContainer}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  onChange={toggleAllImages}
                  checked={
                    selectedImages.length === images.length && images.length > 0
                  }
                />
                전체선택
              </label>
            </div>
            {images.length > 0 ? (
              <div className={styles.imageGrid}>
                {images
                  .slice(
                    currentPage * imagesPerPage,
                    (currentPage + 1) * imagesPerPage
                  )
                  .map((image, index) => (
                    <div key={image.id} className={styles.folder}>
                      <input
                        type="checkbox"
                        className={styles.folderCheckbox}
                        checked={selectedImages.includes(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                      />
                      <img
                        src={image.url}
                        alt={`img-${image.id}`}
                        className={styles.image}
                        onClick={() => openImageModal(index)}
                      />
                    </div>
                  ))}
                <button
                  className={`${styles.navigateButton} ${styles.leftButton} ${
                    currentPage === 0 ? styles.disabled : styles.abled
                  }`}
                  disabled={currentPage === 0}
                  onClick={handlePrevPage}
                >
                  <MdKeyboardArrowLeft />
                </button>

                <button
                  className={`${styles.navigateButton} ${styles.rightButton} ${
                    (currentPage + 1) * imagesPerPage >= images.length
                      ? styles.disabled
                      : styles.abled
                  }`}
                  disabled={(currentPage + 1) * imagesPerPage >= images.length}
                  onClick={handleNextPage}
                >
                  <MdKeyboardArrowRight />
                </button>
              </div>
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>

          {/* 이미지 추가 모달 */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="이미지 등록"
            className={styles.folderModal}
            overlayClassName={styles.folderOverlay}
          >
            <h1>이미지 추가</h1>
            <div {...getRootProps({ className: styles.dropzone })}>
              <input {...getInputProps()} />
              {selectedFiles.length === 0 ? (
                <p onClick={open} style={{ cursor: "pointer" }}>
                  여기를 클릭하거나 파일을 드롭해주세요
                </p>
              ) : (
                <div className={styles.previewArea}>
                  <img
                    src={URL.createObjectURL(selectedFiles[currentImageIndex])}
                    alt={selectedFiles[currentImageIndex].name}
                    className={styles.previewImage}
                  />
                  {selectedFiles.length > 1 && (
                    <div className={styles.slideButtons}>
                      <button
                        onClick={showPreviousFile}
                        className={styles.addleftButton}
                      >
                        {"<"}
                      </button>
                      <button
                        onClick={showNextFile}
                        className={styles.addrightButton}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <ul className={styles.fileList}>
              {selectedFiles.map((file) => (
                <li key={file.name} className={styles.fileItem}>
                  {file.name}
                  <div className={styles.buttonContainer}>
                    <button onClick={open} className={styles.inputButton}>
                      추가
                    </button>
                    <button onClick={() => removeFile(file.name)}>삭제</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.modalButtons}>
              <button className={styles.modalButton} onClick={saveImages}>
                저장
              </button>
              <button
                className={styles.modalButton}
                onClick={() => {
                  setSelectedFiles([]); // 선택된 파일 초기화
                  setIsModalOpen(false); // 모달 닫기
                }}
              >
                취소
              </button>
            </div>
          </Modal>

          {/* 이미지 확대 모달 */}
          <Modal
            isOpen={isImageModalOpen}
            onRequestClose={closeImageModal}
            contentLabel="이미지 보기"
            className={styles.imageModal}
            overlayClassName={styles.folderOverlay}
          >
            <div className={styles.imageModalContent}>
              <button
                onClick={showPreviousImage}
                className={styles.leftimageModalContent}
              >
                {"<"}
              </button>
              <img
                src={images[currentImageIndex]?.url}
                alt={`img-${currentImageIndex}`}
                className={styles.modalImage}
              />
              <button
                onClick={showNextImage}
                className={styles.rightimageModalContent}
              >
                {">"}
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AlbumFolder;
