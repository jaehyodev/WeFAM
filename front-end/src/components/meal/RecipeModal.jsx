import React, { useEffect, useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import modalStyles from "../modal/Modal.module.css";
import styles from "./RecipeModal.module.css";
import Preloader from "../preloader/Preloader";
import { PiTimer } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";

const RecipeModal = ({ meal, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state) => state.user.userData);
  const [recipe, setRecipe] = useState(null);
  const [recipeCook, setRecipeCook] = useState([]);

  const getRecipe = useCallback(async () => {
    if (!meal) {
      return; // meal 데이터가 없는 경우 요청하지 않음
    }

    console.log("meal : ", meal);

    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/recipes/${meal.recipeIdx}`
      );
      console.log("getRecipe 함수 요청 : ", response.data);
      setRecipe(response.data);
      setRecipeCook(response.data.recipeCook.split("|"));
    } catch (error) {
      console.error("식사 데이터 가져오기 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [meal, userData.familyIdx]);

  useEffect(() => {
    getRecipe();
  }, [getRecipe]);

  return ReactDOM.createPortal(
    isLoading ? (
      <div className={modalStyles.modal}>
        <Preloader isLoading={isLoading} />
      </div>
    ) : (
      <div className={modalStyles.modal} onClick={onClose}>
        <div
          className={modalStyles["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.recipe}>
            <div>
              {/* recipe를 사용하여 상세 정보 렌더링 */}
              <div className={styles.header}>
                <div>
                  <h1>{recipe.recipeName}</h1>
                </div>
                <div className={styles.meta}>
                  <div className={styles.time}>
                    <div className={styles.timeLabelContainer}>
                      <div className={styles.metaIcon}>
                        <PiTimer />
                      </div>
                      <div>조리시간</div>
                    </div>
                    <div className={styles.timeDataContainer}>
                      <div className={styles.metaData}>{recipe.recipeTime}</div>
                      <div>분</div>
                    </div>
                  </div>
                  <div className={styles.portion}>
                    <div className={styles.portionLabelContainer}>
                      <div className={styles.metaIcon}>
                        <BsPerson />
                      </div>
                      <div>인분수</div>
                    </div>
                    <div className={styles.portionDataContainer}>
                      <div className={styles.metaData}>
                        {recipe.recipePortion}
                      </div>
                      <div>인분</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.thumbnailContainer}>
                <img
                  className={styles.thumbnail}
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                />
              </div>

              <div className={styles.content}>
                <p>{recipe.recipeDescription}</p>
                <h3>레시피 재료</h3>
                <p>{recipe.recipeIngredient}</p>
                <h3>만드는 방법</h3>
                {recipeCook.map((step, index) => (
                  <div key={index}>
                    <p className={styles.step}>Step {index + 1}</p>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
              {/* 푸터 */}
              <div className={modalStyles.modalFooter}>
                <button className={modalStyles.cancelButton} onClick={onClose}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default RecipeModal;
