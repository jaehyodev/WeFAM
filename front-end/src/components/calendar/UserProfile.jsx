import React, { useState } from "react";
import { FamilyData } from "./FamilyData";
import styles from "./YourStyles.module.css";

const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  const handleUserDataLoaded = (data) => {
    setUserData(data);
  };

  return (
    <div>
      <FamilyData userId={userId} onUserDataLoaded={handleUserDataLoaded} />
      {userData && (
        <div className={styles.profileContainer}>
          {/* 작성자 프로필 이미지와 닉네임 표시 */}
          <div className={styles.profileImageWrapper}>
            <img
              src={userData.profileImg}
              alt="작성자 프로필"
              className={styles.profileImage}
            />
            <span className={styles.nicknameTooltip}>{userData.userNick}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
