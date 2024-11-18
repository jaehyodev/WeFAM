import React from "react";
import styles from "./EventDetail.module.css";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import {
  BsXLg,
  BsThreeDots,
  BsChevronCompactRight,
  BsPinMap,
  BsImages,
  BsChevronDown,
  BsChevronUp,
  BsBorderBottom,
} from "react-icons/bs";
import { RiArrowRightWideLine } from "react-icons/ri";
import { MdOutlineEditNote } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { MapInDetail } from "./LocationMap";
import { useSelector } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; // react-slick 임포트
import DeleteModal from "../modal/DeleteModal";

const EventDetail = ({
  event,
  onClose,
  onDelete,
  onEdit,
  familyUsers,
  familyName,
}) => {
  const eventColor = event.backgroundColor;
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태
  const [eventData, setEventData] = useState(event); // event prop을 상태로 관리
  const menuRef = useRef(null); // 메뉴 div를 참조할 ref 생성
  const [coordinates, setCoordinates] = useState(null);
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // 모달 열림/닫힘 상태 관리
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    // event가 변경될 때마다 coordinates와 location을 설정
    if (event.latitude && event.longitude) {
      setCoordinates({
        lat: event.latitude,
        lng: event.longitude,
      });
    }
  }, [event]);

  const userProfile = familyUsers.find((user) => user.id === event.userId);

  useEffect(() => {
    if (event && event.start && !(event.start instanceof Date)) {
      event.start = new Date(event.start);
    }

    if (event && event.end && !(event.end instanceof Date)) {
      event.end = new Date(event.end);
    }

    setEventData(event); // event prop이 변경될 때마다 eventData를 업데이트
  }, [event]);

  useEffect(() => {
    setEventData(event); // event prop이 변경될 때마다 eventData를 업데이트
  }, [event]);

  // 메뉴 클릭 핸들러
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 메모 클릭 핸들러
  const handleMemoClick = () => {
    setIsMemoOpen(!isMemoOpen);
  };

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", date);
      return ""; // 유효하지 않은 Date 객체인 경우 빈 문자열 반환
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 요일을 가져오는 부분 추가
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${year}/${month}/${day}(${dayOfWeek})`;
  };

  // 시간을 "11:00" 형식으로 반환 (오전/오후 없이)
  const formatTime = (date, includeAMPM = true) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // date가 Date 객체가 아니면 변환
    }

    if (isNaN(date.getTime())) {
      // 유효하지 않은 날짜일 경우 기본값 반환
      return "00:00"; // 기본값으로 00:00 반환
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 오전/오후를 반환
  const formatAMPM = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // date가 Date 객체가 아니면 변환
    }

    if (isNaN(date.getTime())) {
      // 유효하지 않은 날짜일 경우 기본값 반환
      return ""; // 기본값으로 빈 문자열 반환
    }
    const hours = date.getHours();
    return hours >= 12 ? "오후" : "오전";
  };
  const [clicked, setClicked] = useState(false);

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!clicked) {
      setClicked(true); // 조건에 맞는 상태 변경
    }
  };

  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // 전역 클릭 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Slider 설정
  const settings = {
    dots: true,
    infinite: event.files && event.files.length > 1, // 이미지가 1개일 때 무한 스크롤 비활성화
    speed: 500,
    slidesToShow: 1, // 한 번에 하나의 슬라이드만 표시
    slidesToScroll: 1,
    // centerMode: event.files.length > 1, // 이미지가 1개일 때 centerMode 비활성화
    centerPadding: "0", // 여백 없이 슬라이드를 중앙에 맞춤
    arrow: true,
  };

  useEffect(() => {
    setIsOpen(true); // 컴포넌트가 마운트되면 모달을 열림 상태로 설정
  }, []);

  // 삭제 클릭 시 삭제 확인 모달 열기
  const handleDeleteClick = () => {
    setIsDeleteOpen(true); // 삭제 모달을 열기
  };

  // 삭제 확인 후 실제 삭제 처리
  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false); // 삭제 모달 닫기
    onDelete(); // 삭제 로직 실행
  };

  const handleClose = () => {
    setIsOpen(false); // 닫힘 상태로 변경
    setTimeout(onClose, 300); // 애니메이션이 끝난 후에 onClose 호출
  };

  return ReactDOM.createPortal(
    <div
      className={`${styles.EventDetail} ${isOpen ? styles.enter : styles.exit}`} // enter와 exit 클래스 적용
      onClick={(e) => e.stopPropagation()}>
      {/* Header 부분 */}
      <div className={styles.header}>
        <div className={styles.icon}>
          <BsXLg onClick={handleClose} />
        </div>

        <div className={styles.profileContainer}>
          {/* 작성자 프로필 이미지와 호버 시 닉네임 표시 */}
          <div className={styles.profileImageWrapper}>
            <img src={userProfile.profileImg} className={styles.profileImage} />
            <span className={styles.nicknameTooltip}>{userProfile.name}</span>
          </div>
        </div>

        <div className={styles.icon} style={{ marginLeft: "auto" }}>
          <BsThreeDots onClick={handleMenuClick} />
          {isMenuOpen && (
            <div className={styles.menu} ref={menuRef}>
              <div
                onClick={onEdit}
                onMouseEnter={() => setEditHovered(true)}
                onMouseLeave={() => setEditHovered(false)}
                style={{
                  color: editHovered ? eventColor : "inherit",
                  fontWeight: editHovered ? "bold" : "normal",
                  backgroundColor: editHovered ? "#f0f0f0" : "transparent",
                }}>
                수정
              </div>
              <div
                onClick={handleDeleteClick}
                onMouseEnter={() => setDeleteHovered(true)}
                onMouseLeave={() => setDeleteHovered(false)}
                style={{
                  color: deleteHovered ? eventColor : "inherit",
                  fontWeight: deleteHovered ? "bold" : "normal",
                  backgroundColor: deleteHovered ? "#f0f0f0" : "transparent",
                }}>
                삭제
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.title}>
        <h2 style={{ color: eventColor }}>{event.title}</h2>
      </div>
      {/** 일정 기간 */}
      <div
        className={`${styles.details} ${
          event.start !== event.end ? "hasTime" : "noTime"
        } ${event.allDay ? styles.allDay : ""}`}>
        <div className={styles.dateTime}>
          <span className={styles.startDate}>{formatDate(event.start)}</span>
          {!event.allDay && ( // allDay가 false일 때만 시간 표시
            <span className={styles.startTime}>
              <span className={styles.time}>
                {formatTime(event.start, false)}
              </span>
              <span className={styles.ampm}>{formatAMPM(event.start)}</span>
            </span>
          )}
        </div>

        <RiArrowRightWideLine
          className={`${styles.arrow} ${
            eventData.allDay ? styles.smallArrow : ""
          }`}
          style={{ color: eventColor }}
        />

        <div className={styles.dateTime}>
          <span className={styles.endDate}>{formatDate(event.end)}</span>
          {!event.allDay && ( // allDay가 false일 때만 시간 표시
            <span className={styles.endTime}>
              <span className={styles.time}>
                {formatTime(event.end, false)}
              </span>
              <span className={styles.ampm}>{formatAMPM(event.end)}</span>
            </span>
          )}
        </div>
      </div>

      {/*Content 부분*/}
      <div className={styles.memoContainer}>
        <div className={styles.field}>
          <MdOutlineEditNote
            className={styles.icon}
            style={{ color: eventColor, width: 26, height: 26 }}
          />
          <div>
            <h3 className={styles.memoTitle}>메모</h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
              color: eventColor,
            }}>
            {event.content !== "" && !isMemoOpen && (
              <BsChevronUp onClick={handleMemoClick} />
            )}
            {event.content !== "" && isMemoOpen && (
              <BsChevronDown onClick={handleMemoClick} />
            )}
          </div>
        </div>
        {!isMemoOpen && event.content !== "" && (
          <div style={{ padding: "0 18px", marginBottom: "10px" }}>
            <p>
              {event.content.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>

      {/* 지도  */}

      {!coordinates && (
        <div className={styles.locationContainer}>
          <div className={styles.field}>
            <FiMapPin
              className={styles.icon}
              style={{ color: eventColor }} // 선택된 색상이 없으면 기본값
            />
            <div>
              <h3 className={styles.locationName}>장소</h3>
            </div>
          </div>
        </div>
      )}
      {coordinates && (
        <div className={styles.locationContainer}>
          <div className={styles.field}>
            <FiMapPin
              className={styles.icon}
              style={{ color: eventColor }} // 선택된 색상이 없으면 기본값
            />
            <div>
              <h3 className={styles.locationName}>{event.location}</h3>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <MapInDetail coordinates={coordinates} />
          </div>
        </div>
      )}
      <div className={styles.field}>
        <BsImages className={styles.icon} style={{ color: eventColor }} />
        <div>
          <h3 className={styles.locationName}>추억의 순간</h3>
        </div>
      </div>
      {event.files && event.files.length <= 0 && (
        <div style={{ borderTop: "1px solid #f5f5dc" }}></div>
      )}
      {/* 이미지 슬라이더 부분 */}
      {event.files && event.files.length > 0 && (
        <>
          <div className={styles.sliderContainer}>
            <Slider {...settings}>
              {event.files.map((file, index) => (
                <div key={index}>
                  <img
                    src={
                      file.url ||
                      `data:image/${file.fileExtension};base64,${file.fileData}`
                    }
                    alt={`Event file ${index}`}
                    className={styles.image}
                    onClick={(e) => handleImageClick(e)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </>
      )}
      <DeleteModal
        showModal={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)} // 모달 닫기
        onConfirm={handleDeleteConfirm} // 삭제 확인 시 실제 삭제 실행
      />
    </div>,
    document.body // 모달을 body에 추가
  );
};

export default EventDetail;
