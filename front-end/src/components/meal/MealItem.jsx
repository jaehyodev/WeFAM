import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./MealItem.module.css";
import EditMealModal from "./EditMealModal";
import DeleteModal from "../modal/DeleteModal";
import { elapsedTime } from "../../elapsedTime";
import { ToastContainer, toast } from "react-toastify";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";

import { BsThreeDots } from "react-icons/bs";

const MealItem = ({ meal, onSelect, getAllMeals }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);
  const optionsRef = useRef(null); // 옵션 메뉴
  const [authorId, setAuthorId] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isEditMealModalOpen, setIsEditMealModalOpen] = useState(false);

  // MealItem 클릭 시 호출되는 함수
  // Meal 컴포넌트로 recipeIdx 보내서 RecipeModal에 출력
  const handleItemClick = () => {
    onSelect(meal.recipeIdx);
  };

  // 가족 식사 수정 클릭!
  const handleUpdateMeal = (e) => {
    e.stopPropagation(); // 이벤트 버블링 막기
    setSelectedMeal({ mealIdx: meal.mealIdx });
    setIsEditMealModalOpen(true);
  };

  // 삭제 클릭 시 삭제 확인 모달 열기
  const handleDeleteClick = () => {
    setIsDeleteOpen(true); // 삭제 모달을 열기
  };

  // 삭제 확인 후 실제 삭제 처리
  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false); // 삭제 모달 닫기
    handleDeleteMeal(); // 삭제 로직 실행
  };

  // 가족 식사 삭제
  const handleDeleteMeal = async () => {
    try {
      await axios.delete(`http://localhost:8089/wefam/meals/${meal.mealIdx}`);
      toastDelete("가족 식사가 성공적으로 삭제되었습니다!");
      console.log("식사가 성공적으로 삭제되었습니다.");
      onSelect(null);
      getAllMeals();
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
    }
  };

  const toggleOption = (e) => {
    e.stopPropagation();
    setIsOptionsVisible((prev) => !prev);
  };

  const handleClickOutside = useCallback((e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setIsOptionsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isOptionsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsVisible, handleClickOutside]);

  return (
    <div className={styles.mealItem}>
      <div className={styles.mealClickZone} onClick={handleItemClick}>
        <div className={styles.header}>
          <div className={styles.metaContainer}>
            <div className={styles.profileImgContainer}>
              <img src={meal.profileImg} alt="" />
            </div>
            <div className={styles.meta}>
              <div className={styles.authorTime}>
                <span className={styles.author}>{meal.userNick}</span>
                <span>ㆍ</span>
                <span className={styles.time}>
                  {elapsedTime(meal.postedAt)}
                </span>
              </div>
              <div className={styles.location}></div>
            </div>
          </div>

          {userData.id === meal.userId && (
            <div
              className={styles.mealOptionsContainer}
              onClick={toggleOption}
              ref={optionsRef}
            >
              <BsThreeDots />
              {isOptionsVisible && (
                <ul className={styles.options}>
                  <>
                    <li>
                      <button className="option" onClick={handleUpdateMeal}>
                        수정
                      </button>
                    </li>
                    <li>
                      <button className="option" onClick={handleDeleteClick}>
                        삭제
                      </button>
                    </li>
                  </>
                </ul>
              )}
            </div>
          )}
        </div>

        <div className={styles.content}>
          <p>
            식사 일정 : {meal.mealDate}ㆍ{meal.mealType}
          </p>
          <p>요리 제목 : {meal.mealName}</p>
          <img src={meal.mealThumbnail} alt={meal.mealName} />
          <div>{meal.mealContent}</div>
        </div>
      </div>
      {isEditMealModalOpen && (
        <EditMealModal
          meal={selectedMeal}
          getAllMeals={getAllMeals}
          onSave={handleUpdateMeal}
          onClose={() => setIsEditMealModalOpen(false)}
        />
      )}
      <DeleteModal
        showModal={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)} // 모달 닫기
        onConfirm={handleDeleteConfirm} // 삭제 확인 시 실제 삭제 실행
      />
    </div>
  );
};

export default MealItem;
