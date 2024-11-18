import React, { useState } from "react";

const AlarmSetting = ({ color, onAddAlarm }) => {
  const [alarmTime, setAlarmTime] = useState(10); // 기본 알림 시간
  const [alarmUnit, setAlarmUnit] = useState("분 전"); // 기본 알림 단위

  const unitOptions = [
    { label: "분 전", value: "분 전" },
    { label: "시간 전", value: "시간 전" },
    { label: "일 전", value: "일 전" },
    { label: "주 전", value: "주 전" },
  ];

  // 알림 추가 함수
  const handleAddAlarmClick = () => {
    if (onAddAlarm) {
      onAddAlarm(alarmTime, alarmUnit); // 상위 컴포넌트로 알림 정보 전달
    }
  };

  return (
    <div style={{ padding: "5px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>일정 알림</span>
        {/* 알림 시간 숫자 입력 */}
        <input
          type='number'
          value={alarmTime}
          onChange={(e) => setAlarmTime(Number(e.target.value))}
          min={1}
          style={{
            backgroundColor: "#f9f9f9",
            width: "50px",
            height: "30px",
            padding: "5px",
            borderRadius: "5px",
            border: "none",
            textAlign: "center",
            margin: 5,
          }}
        />
        {/* 알림 단위 선택 드롭다운 */}
        <select
          value={alarmUnit}
          onChange={(e) => setAlarmUnit(e.target.value)}
          style={{
            backgroundColor: "#f9f9f9",
            width: "75px",
            height: "30px",
            padding: "5px",
            borderRadius: "5px",
            border: "none",
            textAlign: "center",
          }}>
          {unitOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 알림 추가 버튼 */}
      <button
        onClick={handleAddAlarmClick}
        style={{
          color: color,
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}>
        알림 추가
      </button>
    </div>
  );
};

export default AlarmSetting;
