import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Feed from "./components/feed/Feed";
import Calendar from "./components/calendar/Calendar";
import Meal from "./components/meal/Meal";
import AlbumFolder from "./components/album/AlbumFolder";
import Login from "./components/login/Login";
import RightSidebar from "./components/right-sidebar/RightSidebar";
import Settings from "./components/user-setting/Settings";
import HouseWork2 from "./components/housework/HouseWork2";
import { MemoModal } from "./components/calendar/MemoModal";
import Reward from "./components/header/Reward";
import RewardPoint from "./components/header/RewardPoint";
import Chatbot from "./components/chatbot/Chatbot";
import GroupManagement from "./components/user-setting/GroupManagement";
import ProfileModal from "./components/user-setting/ProfileModal";

import "./css/App.css";
import "./css/Test.css";

import { NotificationProvider } from "./NotificationContext";

function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="main" element={<Home />}>
            <Route index element={<Feed />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="meal" element={<Meal />} />
            <Route path="album" element={<AlbumFolder />} />
            <Route path="settings" element={<GroupManagement />} />
            <Route path="housework2" element={<HouseWork2 />} />
            <Route path="memo" element={<MemoModal />} />
            <Route path="reward" element={<Reward />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="reward-point" element={<RewardPoint />} />
          </Route>
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="profileModal" element={<ProfileModal />} />
        </Routes>
      </NotificationProvider>
    </div>
  );
}

export default App;
