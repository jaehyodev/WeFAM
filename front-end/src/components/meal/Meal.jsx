import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Meal.module.css";
import { BsSearchHeart, BsTrash, BsPlusCircle } from "react-icons/bs";
import mealIcon from "../../assets/images/icon-meal.png";

import Preloader from "../preloader/Preloader";
import MealItem from "./MealItem";
import AddMealModal from "./AddMealModal";
import RecipeModal from "./RecipeModal";
import { ToastContainer, toast } from "react-toastify";
import { toastSuccess, toastDelete } from "../Toast/showCustomToast";

const Meal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  // 가족 식사 모달
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  // 레시피 모달
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);

  const getAllMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/families/${userData.familyIdx}/meals`
      );
      console.log("getAllMeals 함수 요청 : ", response.data);
      setMeals(response.data);
    } catch (error) {
      console.error("식사 데이터 가져오기 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userData.familyIdx]);

  useEffect(() => {
    getAllMeals();
  }, [userData.familyIdx, getAllMeals]);

  // MealItem 클릭 시 호출
  const handleMealClick = (recipeIdx) => {
    if (meals.length >= 0 && recipeIdx !== null) {
      const meal = meals.find((meal) => meal.recipeIdx === recipeIdx);

      console.log("meal : ", meal);
      setSelectedMeal(meal);
      setIsRecipeModalOpen(true);
    } else {
      setSelectedMeal(null);
    }
  };

  // Meal을 DB에 저장
  const addMeal = async (newMeal) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8089/wefam/families/${userData.familyIdx}/meals`,
        newMeal
      );
      // if (response.status === 200) { 이 조건문으로 하면 지연이 있는 지 아래 코드 작동 불가
      toastSuccess("가족 식사가 성공적으로 등록되었습니다!");
      getAllMeals(); // Refresh the meal list
      setIsAddMealModalOpen(false); // Close the modal
      // }
    } catch (error) {
      console.error("새 식사 추가 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main">
      {isLoading ? (
        <Preloader isLoading={isLoading} />
      ) : (
        <>
          <div className={styles.meal}>
            <div className={styles.header}>
              <div>
                <div className={styles.title}>
                  <div>
                    <img src={mealIcon} alt="" />
                  </div>
                  <h1>가족 식사</h1>
                </div>
              </div>

              <div className={styles.controller}>
                <button>
                  <BsSearchHeart />
                </button>
                <button>
                  <BsTrash />
                </button>
                <button onClick={() => setIsAddMealModalOpen(true)}>
                  <BsPlusCircle />
                </button>
              </div>
            </div>
            <div className={styles.content}>
              {meals.length !== 0 &&
                meals.map((meal) => (
                  <MealItem
                    key={meal.mealIdx}
                    meal={meal}
                    onSelect={handleMealClick}
                    getAllMeals={getAllMeals}
                  />
                ))}
            </div>
          </div>
          {isAddMealModalOpen && (
            <AddMealModal
              onSave={addMeal}
              onClose={() => setIsAddMealModalOpen(false)}
            />
          )}
          {isRecipeModalOpen && (
            <RecipeModal
              meal={selectedMeal}
              onClose={() => setIsRecipeModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Meal;
