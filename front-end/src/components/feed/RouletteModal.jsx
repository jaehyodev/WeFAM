import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import modalStyles from "../modal/Modal.module.css";
import styles from "./RouletteModal.module.css";
import Preloader from "../preloader/Preloader";
import axios from "axios";

const RouletteModal = ({ feed, roulette, onSaveRoulette, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [totalAngle, setTotalAngle] = useState(0);
  const [selectedOptionNum, setSelectedOptionNum] = useState(0);
  const [options, setOptions] = useState(["", ""]);
  const [colors, setColors] = useState([]);
  const [isRotated, setIsRotated] = useState(false);
  const [showResult, setShowResult] = useState(false); // 결과를 보여줄지 여부
  const canvasRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    if (options.length > 2 || colors.length !== options.length) {
      const newColors = options.map(() => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
      });

      for (let i = newColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newColors[i], newColors[j]] = [newColors[j], newColors[i]];
      }

      setColors(newColors);
    }
  }, [options]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const cw = canvas.width / 2;
        const ch = canvas.height / 2;
        const arc = Math.PI / (options.length / 2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < options.length; i++) {
          ctx.beginPath();
          ctx.fillStyle = i === selectedOptionNum ? "red" : colors[i];

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
          ctx.fillText(options[i].rouletteOptionContent, 0, 0);
          ctx.restore();
        }
      }
    }
  }, [options, colors, selectedOptionNum]);

  useEffect(() => {
    const fetchRouletteData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8089/wefam/feed/${feed.feedIdx}/roulettes`
        );
        const data = response.data;
        if (data.length > 0) {
          const rouletteData = data.find(
            (r) => r.rouletteIdx === roulette.rouletteIdx
          );
          if (rouletteData) {
            setTitle(rouletteData.rouletteTitle);
            setTotalAngle(rouletteData.totalAngle);
            setSelectedOptionNum(rouletteData.selectedOptionNum);
            setOptions(rouletteData.rouletteOptions);
          }
        }
      } catch (error) {
        console.error(`피드 ${feed.feedIdx}번 룰렛 요청 에러:`, error);
      }
      setIsLoading(false);
    };

    fetchRouletteData();
  }, [feed.feedIdx, roulette.rouletteIdx]);

  const rotate = () => {
    setIsRotated(true);
    const canvas = canvasRef.current;
    const arc = 360 / options.length;

    const rotationAmount = totalAngle;

    canvas.style.transition = "transform 2s ease-out";
    canvas.style.transform = `rotate(${rotationAmount}deg)`;

    // 애니메이션이 끝나면 결과 표시
    setTimeout(() => {
      setShowResult(true);
    }, 2000); // 애니메이션 시간과 동일하게 설정
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

            <div className={styles.rotateBtnContainer}>
              <button
                onClick={rotate}
                className={`${styles.rotateBtn} ${
                  isRotated ? styles.disabled : ""
                }`}
                disabled={isRotated}
              >
                결과 보기
              </button>
            </div>

            <input
              type="text"
              placeholder="제목"
              value={title}
              readOnly={true}
              className={styles.inputTitle}
            />
            <div className={styles.optionsContainer}>
              {options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <input
                    type="text"
                    value={option.rouletteOptionContent}
                    className={styles.inputOption}
                    readOnly={true}
                    style={{
                      backgroundColor:
                        showResult && index === selectedOptionNum - 1
                          ? "#ff4d4d"
                          : "",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className={modalStyles.modalFooter}>
              <button className={modalStyles.cancelButton} onClick={onClose}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default RouletteModal;
