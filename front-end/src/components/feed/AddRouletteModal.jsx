import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./RouletteModal.module.css";
import Preloader from "../preloader/Preloader";
import { addRoulette } from "../../features/roulettesSlice";
import { BsPlusCircle } from "react-icons/bs";

const createRouletteOptionDto = (optionContent, index) => ({
  rouletteOptionNum: index + 1,
  rouletteOptionContent: optionContent,
});

const AddRouletteModal = ({ onSaveRoulette, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const canvasRef = useRef(null);
  const [options, setOptions] = useState(["", ""]);
  const [colors, setColors] = useState([]);
  const [rotationResult, setRotationResult] = useState(null);
  const [newOption, setNewOption] = useState("");
  const arrowRef = useRef(null);

  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const cw = canvas.width / 2;
        const ch = canvas.height / 2;
        const arc = Math.PI / (options.length / 2);

        if (colors.length === 0) {
          const newColors = options.map(() => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r}, ${g}, ${b})`;
          });
          setColors(newColors);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < options.length; i++) {
          ctx.beginPath();
          ctx.fillStyle = colors[i % colors.length];

          const startAngle = arc * i - Math.PI / 2;
          const endAngle = arc * (i + 1) - Math.PI / 2;

          ctx.moveTo(cw, ch);
          ctx.arc(cw, ch, cw, startAngle, endAngle);
          ctx.lineTo(cw, ch);
          ctx.fill();
          ctx.closePath();
        }

        ctx.fillStyle = "#fff";
        ctx.font = "18px Pretendard";
        ctx.textAlign = "center";

        for (let i = 0; i < options.length; i++) {
          const angle = arc * i + arc / 2 - Math.PI / 2;

          ctx.save();
          ctx.translate(
            cw + Math.cos(angle) * (cw - 50),
            ch + Math.sin(angle) * (ch - 50)
          );
          ctx.rotate(angle + Math.PI / 2);
          ctx.fillText(options[i], 0, 0);
          ctx.restore();
        }
      }
    }
  }, [options, colors]);

  const addOption = () => {
    if (options.length < 6) {
      setOptions((prevOption) => [...prevOption, newOption.trim()]);
      const newColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      setColors((prevColors) => [...prevColors, newColor]);
      setNewOption("");
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions((prevOption) => prevOption.filter((_, i) => i !== index));
      setColors((prevColors) => prevColors.filter((_, i) => i !== index));
    } else {
      alert("최소 항목 수는 2개입니다.");
    }
  };

  const deleteOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const checkResult = () => {
    const canvas = canvasRef.current;
    const arc = 360 / options.length; // 각 항목의 회전 각도
    const ran = Math.floor(Math.random() * options.length); // 랜덤 항목 선택
    const rotationAmount = ran * arc + 3600 + Math.floor(Math.random() * 360); // 회전 값 계산 (회전 속도 및 랜덤 추가)

    const normalizedRotation = rotationAmount % 360; // 회전값을 0-359도 범위로 정규화
    const resultIndex =
      Math.floor(
        (options.length - (normalizedRotation / 360) * options.length) %
          options.length
      ) + 1; // 결과 인덱스 계산
    // 회전 각도와 결과 인덱스 반환
    return { totalAngle: rotationAmount, selectedOptionNum: resultIndex };
  };

  const onSave = async () => {
    setIsLoading(true);

    const rouletteOptionsDto = options
      .filter((option) => option.trim() !== "")
      .map((option, index) => createRouletteOptionDto(option, index));

    // checkResult를 호출하여 totalAngle과 selectedOption을 받음
    const { totalAngle, selectedOptionNum } = checkResult();

    const newRoulette = {
      id: Date.now(),
      userId: userData.id,
      rouletteTitle: title,
      rouletteOptions: rouletteOptionsDto,
      totalAngle,
      selectedOptionNum,
    };

    console.log(rouletteOptionsDto);

    console.log("newRoulette", newRoulette);
    dispatch(addRoulette(newRoulette));

    setIsLoading(false);

    onSaveRoulette(newRoulette);

    onClose();
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
          <div className={styles.main}>
            <div className={styles.canvasContainer}>
              <canvas
                ref={canvasRef}
                width="300"
                height="300"
                className={styles.canvas}
              />
              <div ref={arrowRef} className={styles.arrow}></div>
            </div>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputTitle}
            />
            <div className={styles.optionsContainer}>
              {options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <input
                    type="text"
                    placeholder={`옵션 ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={styles.inputOption}
                  />
                  <button
                    onClick={() => deleteOption(index)}
                    className={`${styles.deleteOptionBtn} ${
                      options.length <= 2 ? styles.disabled : styles.abled
                    }`}
                    disabled={options.length <= 2}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button onClick={addOption} className={styles.addOptionBtn}>
                <BsPlusCircle /> &nbsp; 항목 추가
              </button>
            )}

            <div className={modalStyles.modalFooter}>
              <button className={modalStyles.cancelButton} onClick={onClose}>
                취소
              </button>
              <button className={modalStyles.saveButton} onClick={onSave}>
                등록
              </button>
            </div>
          </div>{" "}
        </div>
      </div>
    ),
    document.body
  );
};

export default AddRouletteModal;
