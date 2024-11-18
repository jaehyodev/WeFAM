import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./AddMealModal.module.css";
import Preloader from "../preloader/Preloader";
import logoFoodie from "../../assets/images/logo-foodie.png";

const AddMealModal = ({ onSave, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mealDate, setMealDate] = useState("");
  const [mealType, setMealType] = useState("");
  const [mealContent, setMealContent] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);

  const handleSave = () => {
    // recipeUrl에서 마지막 슬래시의 인덱스를 찾음
    const lastSlashIndex = recipeUrl.lastIndexOf("/");

    // 마지막 슬래시 이후의 문자열을 추출
    const recipeIdxString = recipeUrl.substring(lastSlashIndex + 1);

    // 추출한 문자열을 숫자로 변환
    const recipeIdx = parseInt(recipeIdxString, 10);

    // recipeIdx가 NaN인 경우 경고 표시
    if (isNaN(recipeIdx)) {
      alert("유효하지 않은 레시피 URL입니다. URL이 숫자로 끝나야 합니다.");
      return;
    }
    // const recipeIdx
    const newMeal = {
      userId: userData.id,
      mealDate,
      mealType,
      mealContent,
      recipeIdx,
    };
    onSave(newMeal);
  };

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
          <div className={styles.header}>
            <h1>새로운 식사</h1>
          </div>
          <div className={styles.content}>
            <div className={styles.logoContainer}>
              <img src={logoFoodie} alt="Foodie" />
            </div>
            <p>푸디 웹사이트에서 레시피 URL을 아래에 복사 붙여넣기하세요.</p>
            <ul>
              <li>
                <label htmlFor="recipeUrl">URL</label>
                <input
                  type="url"
                  id="recipeUrl"
                  className={styles.inputUrl}
                  placeholder="http://www.foodie.com/1234"
                  value={recipeUrl}
                  onChange={(e) => setRecipeUrl(e.target.value)}
                />
              </li>
              <li>
                <span>
                  <label htmlFor="date">날짜</label>
                  <input
                    type="date"
                    id="date"
                    className={styles.inputDate}
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                  />
                </span>
                <span>
                  <label htmlFor="mealType">구분</label>

                  <select
                    id="mealType"
                    className={styles.inputType}
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    <option value="아침">아침</option>
                    <option value="점심">점심</option>
                    <option value="간식">간식</option>
                    <option value="저녁">저녁</option>
                    <option value="야식">야식</option>
                  </select>
                </span>
              </li>
            </ul>
            <textarea
              placeholder="내용을 입력하세요."
              value={mealContent}
              onChange={(e) => setMealContent(e.target.value)}
            ></textarea>
          </div>

          {/* 푸터 */}
          <div className={modalStyles.modalFooter}>
            <button className={modalStyles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button className={modalStyles.saveButton} onClick={handleSave}>
              등록
            </button>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default AddMealModal;
