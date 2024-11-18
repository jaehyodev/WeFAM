// import React, { useState, useEffect } from "react";
// import styles from "./PersonalInfo.module.css";
// import { useSelector } from "react-redux";
// import axios from "axios";

// const PersonalInfo = () => {
//   const [userImages, setUserImages] = useState([]);
//   // Redux에서 사용자 정보 가져오기
//   const userData = useSelector((state) => state.user.userData);
//   const [nickname, setNickname] = useState(userData ? userData.name : "");

//   // useEffect(() => {
//   //   if (userData) {
//   //     // 실제 사용자 데이터를 가져오는 axios 요청
//   //     axios.get('http://localhost:8089/wefam/get-family')
//   //       .then(response => {
//   //         const loadedImages = response.data.map(user => user.profileImg);
//   //         setUserImages(loadedImages);
//   //       })
//   //       .catch(error => {
//   //         console.error("가져오기 에러!!", error);
//   //       });
//   //   }
//   // }, [userData]); // userData가 변경될 때마다 실행

//   return (
//     <div className={styles.personalInfo}>
//       <h1>개인정보 관리</h1>
//       <hr />
//       <div className={styles.profileContainer}>
//         <span>개인 프로필 사진</span>
//         <div className={styles.profileInfo}>
//           {
//             <img
//               src={userData.profileImg}
//               alt="Profile"
//               className={styles.profileImg}
//             />
//           }
//           <button className={styles.editImgButton}>수정</button>
//         </div>
//       </div>
//       <hr />
//       <div className={styles.profileContainer}>
//         <span>닉네임</span>
//         <div>
//           <input type="text" className={styles.editNick} />{" "}
//           {/* value={userData.name} */}
//           <button className={styles.editNickButton}>수정</button>
//         </div>
//       </div>
//       <hr />
//     </div>
//   );
// };

// export default PersonalInfo;
