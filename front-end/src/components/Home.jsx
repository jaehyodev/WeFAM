import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./header/Header";
import LeftSidebar from "./left-sidebar/LeftSidebar";
import RightSidebar from "./right-sidebar/RightSidebar";

const Home = () => {
  const location = useLocation();
  const userData = location.state?.userData || null;

  useEffect(() => {}, [userData]);
  return (
    <div>
      <Header />
      <LeftSidebar />
      {/* 이 부분에 중첩된 라우트가 렌더링됩니다 */}
      <Outlet />
      <RightSidebar userData={userData} />
    </div>
  );
};

export default Home;
