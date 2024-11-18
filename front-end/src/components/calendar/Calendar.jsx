import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import EventModal from "./EventModal";
import { BsSearch, BsPlusCircle } from "react-icons/bs";
import styles from "./Calendar.module.css";
import EventDetail from "./EventDetail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";
import SearchResults from "./SearchResults";

const Calendar = () => {
  const calendarRef = useRef(null); // FullCalendar를 가리킬 ref
  const clickTimeout = useRef(null);
  const [holidays, setHolidays] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림/닫힘 상태
  const [isEventOpen, setIsEventOpen] = useState(false); // 일정 창 열림/닫힘 상태
  const [isDetailOpen, setIsDeatilOpen] = useState(false); // 모달 상세 창 열림/닫힘 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색 창
  const [isSearchVisible, setIsSearchVisible] = useState(false); // 검색창 보임 여부 상태
  const [events, setEvents] = useState([]);
  const [familyUsers, setFamilyUsers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [familyFiles, setFamilyFiles] = useState([]);
  const [familyIdx, setFamilyIdx] = useState(null); // familyIdx 상태 추가
  const [eventFiles, setEventFiles] = useState([]);
  const searchInputRef = useRef(null); // 검색창 요소 참조를 위한 useRef
  const [filteredEvents, setFilteredEvents] = useState([]); // 검색된 일정 상태

  // let clickTimeout = null;

  const userData = useSelector((state) => state.user.userData);

  // 검색된 일정 필터링 함수
  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // 검색 아이콘 클릭 시 검색창 보이기/숨기기 토글
  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchTerm(""); // 검색어 초기화
    }
    setIsSearchVisible(!isSearchVisible); // 검색창 보이기/숨기기 토글
  };

  useEffect(() => {
    // 패밀리 데이터를 가져오는 함수
    const fetchFamilyData = async () => {
      try {
        // 패밀리 이름 가져오기
        const familyResponse = await axios.get(
          `http://localhost:8089/wefam/family-name/${userData.id}`
        );
        setFamilyName(familyResponse.data.familyName);
        setFamilyIdx(familyResponse.data.familyIdx);

        // 패밀리 사용자 목록 가져오기
        const familyUsersResponse = await axios.get(
          `http://localhost:8089/wefam/family-users/${userData.id}`
        );
        setFamilyUsers(familyUsersResponse.data);
      } catch (error) {
        console.error("Error fetching family data:", error);
      }
    };

    fetchFamilyData();
  }, [userData.id]);

  const fetchFamilyFiles = async () => {
    if (familyIdx != null) {
      try {
        const familyFilesResponse = await axios.get(
          `http://localhost:8089/wefam/event/files/family/${familyIdx}`
        );
        setFamilyFiles(familyFilesResponse.data);
      } catch (error) {
        console.error("Error fetching family files:", error);
      }
    }
  };

  useEffect(() => {
    if (familyIdx !== null && familyIdx !== undefined) {
      fetchFamilyFiles();
    }
  }, [familyIdx]);

  // selectedEvent가 변경될 때마다 관련 파일을 업데이트
  useEffect(() => {
    if (!selectedEvent || familyFiles.length === 0) return;

    const selectedEventId = Number(selectedEvent.id);
    const filteredFiles = familyFiles.filter(
      (file) =>
        file.entityType === "event" &&
        Number(file.entityIdx) === selectedEventId
    );

    setEventFiles(filteredFiles);
  }, [selectedEvent, familyFiles]);

  useEffect(() => {
    if (selectedEvent) {
      // 이전 파일과 새로운 eventFiles를 비교해서 다를 때만 상태 업데이트
      setSelectedEvent((prevEvent) => {
        if (JSON.stringify(prevEvent.files) !== JSON.stringify(eventFiles)) {
          return {
            ...prevEvent,
            files: eventFiles,
          };
        }
        return prevEvent; // 파일이 같으면 상태를 변경하지 않음
      });
    }
  }, [eventFiles, selectedEvent]);

  //요일에 따른 날짜 색상
  const renderDayCellContent = (info) => {
    const dayOfWeek = info.date.toLocaleDateString("en-US", {
      weekday: "short",
    }); // 'Sat', 'Sun' 등으로 요일 텍스트 가져옴
    let color = "";

    // 'Sat'이 포함되면 파란색, 'Sun'이 포함되면 빨간색 설정
    if (dayOfWeek.includes("Sat")) {
      color = "#2F76F9"; // 토요일: 파란색
    } else if (dayOfWeek.includes("Sun")) {
      color = "#FF4D4D"; // 일요일: 빨간색
    }

    // 오늘 날짜인지 확인
    const today = new Date();
    const isToday = info.date.toDateString() === today.toDateString();

    // 오늘이면 색상을 흰색으로 설정
    if (isToday) {
      color = "#FFFFFF"; // 흰색
    }

    return (
      <div style={{ color: color }}>
        {info.dayNumberText.replace("일", "")} {/* 날짜 번호에서 '일' 제거 */}
      </div>
    );
  };

  // 그룹원 일정 가져오기
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8089/wefam/calendar");
      const fullCalendarEvents = response.data.map((event) => {
        const startDate = new Date(`${event.eventStDt}T${event.eventStTm}`);
        const endDate = new Date(`${event.eventEdDt}T${event.eventEdTm}`);

        return {
          id: event.eventIdx,
          title: event.eventTitle,
          start: startDate.toISOString(), // ISO 8601 형식으로 변환
          end: endDate.toISOString(), // ISO 8601 형식으로 변환
          backgroundColor: event.eventColor,
          familyIdx: event.familyIdx,
          userId: event.userId,
          content: event.eventContent,
          location: event.eventLocation,
          isholiday: false,
          classNames: ["custom-dot-event"],
          allDay: event.isAllDay == 1,
          latitude: event.latitude,
          longitude: event.longitude,
        };
      });

      setEvents(fullCalendarEvents);
    } catch (error) {
      console.error("Error fetching events:", error); // 오류 로그 추가
    }
  };

  useEffect(() => {
    fetchFamilyFiles();
    fetchEvents();
  }, []);

  // 공휴일 데이터 가져오기
  useEffect(() => {
    const year = new Date().getFullYear(); // 현재 연도를 기준으로 데이터 호출

    // API 호출 함수
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo`,
          {
            params: {
              solYear: year,
              numOfRows: 100, // 최대 0개의 공휴일 데이터를 가져옴
              _type: "json",
              ServiceKey:
                "I3GsqBPcPMRFC5X+f4CwHDDAlbrdlj4xF8U9EmfWAJwkMQI7tm9rbSrPfo4lm1QdvIBcWBwU5375scGyeT/hiA==",
            },
          }
        );

        const items = response?.data?.response?.body?.items?.item || [];

        // 공휴일 데이터를 'items'에서 가져와 그룹화 처리 후 holidays 상태에 저장
        const groupByDateName = (items) => {
          return items.reduce((acc, item) => {
            const locDateString = item.locdate.toString(); // YYYYMMDD 형식
            const year = locDateString.slice(0, 4);
            const month = locDateString.slice(4, 6);
            const day = locDateString.slice(6, 8);

            const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 변환

            if (!acc[item.dateName]) {
              acc[item.dateName] = [];
            }

            acc[item.dateName].push(formattedDate);
            return acc;
          }, {});
        };

        const holidaysData = Object.entries(groupByDateName(items)).map(
          ([dateName, dates]) => {
            // 날짜 배열을 오름차순으로 정렬하여 시작일과 종료일을 구합니다.
            dates.sort();

            const start = dates[0]; // 가장 빠른 날짜가 시작일
            const endDate = new Date(dates[dates.length - 1]); // 가장 늦은 날짜가 종료일
            endDate.setDate(endDate.getDate() + 1); // 종료일을 다음 날로 설정

            return {
              title: dateName,
              start: start, // 시작 날짜
              end: endDate.toISOString().split("T")[0], // 종료 날짜 (포함되도록 다음 날로 설정)
              allDay: true,
              backgroundColor: "#FF0000",
              editable: false,
              isHoliday: true, // 공휴일 여부 플래그 추가
            };
          }
        );

        // 상태 업데이트
        setHolidays(holidaysData);
      } catch (error) {
        console.error("Error fetching holidays", error);
      }
    };

    fetchHolidays();
  }, []);

  // 일정 저장
  const saveEvent = async (updatedEvent) => {
    // 날짜와 시간을 분리하여 서버에 보낼 형식으로 변환
    const formatDate = (date) => {
      // date가 Date 객체가 아닐 경우, Date 객체로 변환
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formatTime = (date) => {
      // date가 Date 객체가 아니면 변환 시도
      if (!(date instanceof Date)) {
        date = new Date(date); // date가 문자열이면 Date 객체로 변환
      }

      if (isNaN(date.getTime())) {
        // 유효한 날짜가 아닐 경우 null 반환
        return "00:00:00"; // 기본값으로 00:00 반환
      }
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`; // 'HH:MM:SS' 형식으로 변환
    };

    // 날짜와 시간으로 분리
    const eventToSave = {
      ...updatedEvent,
      eventContent: updatedEvent.content,
      eventTitle: updatedEvent.title,
      eventStDt: formatDate(new Date(updatedEvent.start)),
      eventStTm: formatTime(new Date(updatedEvent.start)),
      eventEdDt: formatDate(new Date(updatedEvent.end)),
      eventEdTm: formatTime(new Date(updatedEvent.end)),
      eventColor: updatedEvent.backgroundColor, // 필드명 맞춤
      isAllDay: updatedEvent.allDay,
      userId: userData.id,
      eventLocation: updatedEvent.location,
      latitude: updatedEvent.latitude,
      longitude: updatedEvent.longitude,
    };

    try {
      let savedEvent;

      if (updatedEvent.id) {
        const response = await axios.post(
          `http://localhost:8089/wefam/update-event/${updatedEvent.id}`,
          eventToSave,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSelectedEvent({
          ...selectedEvent,
          ...updatedEvent,
        }); // 변경된 이벤트로 selectedEvent 업데이트
        console.log("이벤트 업데이트 응답:", response); // 서버 응답 로그
        toastSuccess("일정이 성공적으로 업데이트되었습니다!"); // 성공 토스트 메시지
        await fetchEvents();
        setIsModalOpen(false);
        savedEvent = response.data;
      } else {
        const response = await axios.post(
          `http://localhost:8089/wefam/add-event`,
          eventToSave,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSelectedEvent({
          ...selectedEvent,
          ...updatedEvent,
        }); // 변경된 이벤트로 selectedEvent 업데이트
        toastSuccess("일정이 성공적으로 등록되었습니다!"); // 성공 토스트 메시지

        savedEvent = response.data;
      }
      // savedEvent가 undefined인 경우를 처리
      if (!savedEvent) {
        throw new Error("Event could not be saved.");
      }

      // 이벤트가 저장된 후, 파일 업로드 처리
      if (updatedEvent.newFiles && updatedEvent.newFiles.length > 0) {
        const formData = new FormData();
        updatedEvent.newFiles.forEach((fileWrapper) => {
          formData.append("files", fileWrapper.file);
        });
        formData.append("familyIdx", savedEvent.familyIdx);
        formData.append("userId", savedEvent.userId);
        formData.append("entityIdx", savedEvent.eventIdx); // 저장된 이벤트의 ID를 사용

        await axios.post(
          `http://localhost:8089/wefam/event/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // 삭제된 파일 처리
      if (
        updatedEvent.deletedFileIds &&
        updatedEvent.deletedFileIds.length > 0
      ) {
        await Promise.all(
          updatedEvent.deletedFileIds.map(async (fileIdx) => {
            await axios.delete(
              `http://localhost:8089/wefam/event/files/delete/${fileIdx}`
            );
          })
        );
      }
      await fetchFamilyFiles();
      await fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating event:", error); // 에러 처리}
    }
  };

  // 이동 저장
  const handleEventDrop = async (dropInfo) => {
    const updatedEvent = {
      ...dropInfo.event.extendedProps, // 기존 이벤트 정보 복사
      id: dropInfo.event.id,
      title: dropInfo.event.title,
      start: dropInfo.event.start, // 시작 날짜
      end: dropInfo.event.end,
      allDay: dropInfo.event.allDay ? 1 : 0, // allDay 여부를 int로 변환
      backgroundColor: dropInfo.event.backgroundColor,
      latitude: dropInfo.event.extendedProps.latitude,
      longitude: dropInfo.event.extendedProps.longitude,
      location: dropInfo.event.extendedProps.location,
      content: dropInfo.event.extendedProps.content,
    };

    try {
      // 이동된 이벤트를 서버에 저장하는 함수 호출
      await saveEvent(updatedEvent);

      // 상태 업데이트를 통해 이벤트 반영
      setSelectedEvent(updatedEvent);

      // FullCalendar에서 이벤트 다시 로드
      calendarRef.current.getApi().refetchEvents(); // 이 위치에서 호출
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  useEffect(() => {
    // selectedEvent가 존재할 때만 처리
    if (selectedEvent) {
      // 로그 출력 - 선택된 이벤트 변경 감지
      // 상태 업데이트는 여기서 하지 않음 (무한 루프 방지)
      // 상태 업데이트는 이벤트 핸들러(예: 드롭 완료 후 저장 등)에서만 수행
    }
  }, [selectedEvent]);

  // 일정 삭제
  const handleDeleteClick = async () => {
    if (!selectedEvent || !selectedEvent.id) {
      console.error("선택된 이벤트가 없습니다.");
      return;
    }

    const eventIdx = selectedEvent.id;
    try {
      // 서버에 삭제 요청 보내기
      const response = await axios.delete(
        `http://localhost:8089/wefam/delete-event/${selectedEvent.id}`
      );

      if (response.status === 200) {
        toastDelete("일정이 성공적으로 삭제되었습니다!"); // 삭제 성공 메시지 표시

        // 이벤트 목록에서 삭제된 이벤트 제거
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventIdx)
        );
        await fetchEvents();
        // 모달 닫기
        setIsEventOpen(false);
        setIsDeatilOpen(false);
      } else {
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // 검색 결과에서 선택한 일정 클릭
  const handleSearchResultClick = (event) => {
    // start와 end 시간이 존재할 경우 시간을 추출하여 문자열로 변환
    const formatTime = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // 문자열이나 다른 유형의 데이터가 들어오면 Date 객체로 변환
      }

      if (isNaN(date.getTime())) {
        return "00:00:00"; // 유효하지 않은 날짜인 경우 기본값
      }

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}:00`;
    };

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start, // 기존 날짜 그대로 유지
      startTime: formatTime(event.start), // 시간 추출
      end: event.end || event.start, // 기존 날짜 그대로 유지
      endTime: formatTime(event.end || event.start), // 시간 추출
      allDay: event.allDay,
      backgroundColor: event.backgroundColor,
      familyIdx: event.familyIdx || null, // 검색에서 추가된 데이터 처리
      content: event.content || "", // 검색에서 추가된 데이터 처리
      userId: event.userId || null, // 검색에서 추가된 데이터 처리
      eventLocation: event.location || "",
      latitude: event.latitude || null,
      longitude: event.longitude || null,
      location: event.location || "",
    });

    setIsSearchVisible(false);
    setIsDeatilOpen(false);
    setIsEventOpen(true);
  };

  // 일정 클릭
  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.isHoliday) {
      return;
    }

    // start와 end 시간이 존재할 경우 시간을 추출하여 문자열로 변환
    const formatTime = (date) => {
      // date가 Date 객체가 아니면 변환 시도
      if (!(date instanceof Date)) {
        date = new Date(date); // 문자열이나 다른 유형의 데이터가 들어오면 Date 객체로 변환
      }

      // 변환 후에도 유효한 Date 객체가 아니면 기본값을 반환
      if (isNaN(date.getTime())) {
        return "00:00:00"; // 기본값으로 00:00 반환
      }

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}:00`;
    };

    const { extendedProps } = clickInfo.event; // extendedProps에서 추가 데이터 추출

    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start, // 원래 날짜
      startTime: formatTime(clickInfo.event.start), // 시간 추출

      end: clickInfo.event.end || clickInfo.event.start, // 원래 날짜
      endTime:
        formatTime(clickInfo.event.end) || formatTime(clickInfo.event.start), // 시간 추출

      allDay: clickInfo.event.allDay, // allDay 여부
      backgroundColor: clickInfo.event.backgroundColor,
      familyIdx: extendedProps.familyIdx, // extendedProps에서 familyIdx 가져오기
      content: extendedProps.content, // extendedProps에서 content 가져오기
      userId: extendedProps.userId, // extendedProps에서 userId 가져오기
      eventLocation: extendedProps.location,
      latitude: extendedProps.latitude,
      longitude: extendedProps.longitude,
      location: extendedProps.location,
    });

    setIsDeatilOpen(false);
    setIsEventOpen(true);
  };

  // 이벤트 클릭 시 모달을 열고 선택된 이벤트 저장
  const handleEditClick = () => {
    if (!selectedEvent) {
      console.error("clickInfo.event is undefined");
      return;
    }

    setIsDeatilOpen(true);
    setIsModalOpen(true);
  };

  //추가
  const handleAddEventClick = () => {
    setSelectedEvent({
      start: new Date(),
      end: new Date(),

      backgroundColor: "#FF4D4D",
      allDay: false,
      userId: userData.id,
      familyIdx: familyIdx,
    });
    setIsDeatilOpen(false);
    setIsModalOpen(true);
    setIsEventOpen(false);
  };

  // 날짜 셀을 더블클릭했을 때 이벤트 추가를 위한 모달 열기 함수
  const handleDateDoubleClick = (info) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;

      setSelectedEvent({
        start: info.date,
        end: info.date,
        backgroundColor: "#FF4D4D",
        allDay: false,
        userId: userData.id,
        familyIdx: familyIdx,
      });
      setIsDeatilOpen(false);
      setIsEventOpen(false);
      setIsModalOpen(true);
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
      }, 300); // 더블클릭을 감지하기 위한 300ms 대기
    }
  };

  //풀캘린터 차트 CSS
  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const sameDate = startDate.toDateString() === endDate.toDateString();
    const startTime = event.start
      ? new Date(event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
        {/* allDay가 true이거나 날짜가 다를 때 바 형태로 표시 */}
        {event.allDay || !sameDate ? (
          <>
            <div
              style={{
                width: "100%",
                height: "16px",
                backgroundColor: event.backgroundColor || "#FF4D4D",
                borderRadius: "2px",
                position: "relative",
              }}>
              <span
                style={{
                  position: "relative",
                  height: "100%",
                  left: "10px",
                  right: "10px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "8px",
                  color: "#fff", // 바 형태에서는 흰색 글씨로 표시
                }}>
                {event.title}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* allDay가 false이면서 날짜가 같을 때 도트와 시간 표시 */}
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: event.backgroundColor || "#FF4D4D",
                marginRight: "5px", // 도트와 타이틀 사이에 간격 추가
                flexShrink: 0,
              }}
            />
            <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                flexGrow: 1, // 제목이 가능한 공간을 많이 차지하도록
                minWidth: "0",
              }}>
              {event.title}
            </span>
            <span
              style={{
                textAlign: "right",
                fontSize: "0.9em",
                color: "#666",
                flexShrink: 0,
              }}>
              {startTime}
            </span>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    const searchButton = document.querySelector(".fc-customSearch-button");
    const addButton = document.querySelector(".fc-customAddEvent-button");

    if (searchButton) {
      if (!searchButton._root) {
        searchButton._root = createRoot(searchButton);
      }
      searchButton._root.render(
        <div>
          <BsSearch
            style={{
              width: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "24px",
            }}
          />
        </div>
      );
    }

    if (addButton) {
      if (!addButton._root) {
        addButton._root = createRoot(addButton);
      }
      addButton._root.render(
        <BsPlusCircle
          style={{
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      );
    }
  }, []);

  return (
    <div className='main'>
      {/* 검색 기능 */}
      <div style={{ width: "80%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "6px",
            padding: "5px",
            position: "relative", // 검색 결과를 검색창 아래에 위치시키기 위해 relative 설정
          }}>
          <input
            ref={searchInputRef} // 검색창을 참조
            type='text'
            placeholder='일정 검색'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
            className={`${styles["search-input"]} ${
              isSearchVisible ? styles["active"] : ""
            }`} // 애니메이션 클래스 적용
          />
        </div>
        {/* 검색 결과 리스트 */}
        {isSearchVisible && (
          <SearchResults
            filteredEvents={filteredEvents}
            onEventClick={handleSearchResultClick}
          />
        )}
        <div
          style={{
            backgroundColor: "#ffffff",
            marginTop: "2rem",
            borderRadius: "1rem",
            padding: "1rem",
          }}>
          <FullCalendar
            ref={calendarRef} // ref 연결
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView='dayGridMonth'
            locale='ko'
            nowIndicator={true}
            selectable={true}
            headerToolbar={{
              left: "title",
              center: "prev,today,next",
              right: "customSearch,customAddEvent", // 커스텀 버튼 추가
            }}
            editable={true}
            buttonText={{
              today: "오늘",
              month: "월간",
              week: "주간",
              day: "일간",
              allDay: "하루종일",
            }}
            height='80vh'
            dayCellContent={renderDayCellContent}
            allDaySlot={true}
            droppable={true}
            weekends={true}
            eventTimeFormat={true}
            events={[...holidays, ...events]}
            eventDrop={handleEventDrop}
            // 일정 클릭 시 EventInfo 컴포넌트를 열기 위한 함수
            eventClick={handleEventClick}
            // 날짜 셀 클릭 시 새로운 이벤트를 추가하기 위한 모달 열기
            dateClick={handleDateDoubleClick}
            dayMaxEvents={3}
            moreLinkClick='popover' // 'View More' 클릭 시 팝업으로 나머지 일정 표시
            eventContent={renderEventContent}
            customButtons={{
              customSearch: {
                text: "", // 텍스트 비움
                click: () => setIsSearchVisible(!isSearchVisible),
              },
              customAddEvent: {
                text: "", // 텍스트 비움
                click: handleAddEventClick,
              },
            }}
          />

          {/* 모달이 열렸을 때만 EventModal 컴포넌트 렌더링 */}
          {isModalOpen && (
            <EventModal
              event={selectedEvent}
              onSave={saveEvent}
              familyName={familyName}
              familyUsers={familyUsers}
              onClose={() => setIsModalOpen(false)} // 모달 닫기 함수 전달
              isDetailOpen={isDetailOpen} // isDetailOpen 상태 전달
            />
          )}

          {/* 모달이 열렸을 때만 DetailModal 컴포넌트 렌더링 */}
          {isEventOpen && (
            <EventDetail
              key={selectedEvent.id}
              event={selectedEvent}
              familyName={familyName}
              familyUsers={familyUsers}
              onEdit={handleEditClick} // 수정 버튼에 사용할 함수
              onDelete={handleDeleteClick} // 삭제 버튼에 사용할 함수
              onClose={() => setIsEventOpen(false)} // 모달 닫기 함수 전달
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
