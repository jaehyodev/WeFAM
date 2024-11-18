import React, { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux"; // 사용자 정보를 가져오기 위해 useSelector 사용

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const userData = useSelector((state) => state.user.userData); // Redux에서 userData 가져오기

  useEffect(() => {
    if (!userData || !userData.id) {
      console.error(
        "userData 또는 userData.id가 없습니다. SSE 연결을 시도하지 않습니다."
      );
      return;
    }

    const eventSource = new EventSource(
      `http://localhost:8089/wefam/notifications/${userData.id}`
    );

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      eventSource.close();

      setTimeout(() => {
        const newEventSource = new EventSource(
          `http://localhost:8089/wefam/notifications/${userData.id}`
        );
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [userData]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
