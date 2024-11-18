// import React, { useState } from 'react';
// import FamilyManagement from './FamilyManagement';
// import GroupManagement from './GroupManagement';
// import styles from './Settings.module.css';

// const Settings = () => {
//   const [activeMenu, setActiveMenu] = useState('family-management');  // 초기 상태를 'family-management'로 설정

//   const renderContent = () => {
//     switch (activeMenu) {
//       // case 'family-management':
//       //   return <FamilyManagement />;
//       case 'group-management':
//         return <GroupManagement />;
//       default:
//         return <GroupManagement />;
//     }
//   };

//   return (
//     <div className='main'>
//       <div className={styles.settingsPage}>
//         {/* <div className={styles.menu}>
//           <ul>
//             <li 
//               onClick={() => setActiveMenu('family-management')} 
//               className={activeMenu === 'family-management' ? styles.active : ''}
//             >
//               가족 구성원 정보
//             </li>
//             <li 
//               onClick={() => setActiveMenu('group-management')} 
//               className={activeMenu === 'group-management' ? styles.active : ''}
//             >
//               가족 정보 관리
//             </li>
//           </ul>
//         </div> */}
//         <div className={styles.content}>
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;
