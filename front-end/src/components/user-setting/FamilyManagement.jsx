// import React, { useState, useEffect } from "react";
// import styles from "./FamilyManagement.module.css";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ProfileModal from "./ProfileModal";

// const FamilyManagement = () => {
//   const [users, setUsers] = useState([]);
//   const userData = useSelector((state) => state.user.userData);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);

//   useEffect(() => {
//     console.log(userData);
    
//     if (userData) {
//       axios
//         .get("http://localhost:8089/wefam/get-family")
//         .then((response) => {
//           setUsers(response.data); // 사용자 정보 업데이트
//         })
//         .catch((error) => {
//           console.error("가져오기 에러!!", error);
//         });
//     }
//   }, [userData, isModalOpen]);

//   const openModal = (user) => {
//     setSelectedProfile(user);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedProfile(null);
//   };

//   const handleInputChange = (e) => {
//     setSelectedProfile({
//       ...selectedProfile,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // 바뀐 값을 DB에 저장하기
//   const handleSaveChanges = () => {
//     axios
//       .put("http://localhost:8089/wefam/update-profile", selectedProfile)
//       .then((response) => {
//         console.log("프로필 업데이트 성공:", response.data);

//         // 사용자 정보를 다시 가져오기
//         axios
//           .get("http://localhost:8089/wefam/get-family")
//           .then((response) => {
//             setUsers(response.data); // 사용자 정보 업데이트
//             closeModal(); // 모달 닫기
//           })
//           .catch((error) => {
//             console.error("사용자 정보 업데이트 실패:", error);
//           });
//       })
//       .catch((error) => {
//         console.error("프로필 업데이트 실패:", error);
//       });
//   };

//   return (
//     <div className={styles.personalInfo}>
//       <h1>가족 구성원 정보</h1>
//       <hr />
//       {users.map((user, index) => (
//         <div>
//           <div key={index} className={styles.profileContainer}>
//             <div className={styles.profileInfo}>
//               <img
//                 src={user.profileImg}
//                 alt='Profile'
//                 className={styles.profileImg}
//               />
//               <span className={styles.username}>{user.name}</span>
//               <span className={styles.nickname}>({user.nick})</span>
//               <button
//                 className={styles.editButton}
//                 onClick={() => openModal(user)}>
//                 {user.id === userData.id ? "정보 수정" : "가족 정보"}
//               </button>
//             </div>
//             <hr className={styles.hrLine} /> {/* 줄어든 hr 태그 */}
//           </div>
//         </div>
//       ))}

//       {selectedProfile && (
//         <ProfileModal
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           profile={selectedProfile}
//           isEditing={selectedProfile.id === userData.id} // 본인의 프로필인지 확인
//           handleInputChange={handleInputChange}
//           handleSaveChanges={handleSaveChanges}
//         />
//       )}
//     </div>
//   );
// };

// export default FamilyManagement;
