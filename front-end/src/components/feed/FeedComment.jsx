// Comment.js
import { React, useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./FeedComment.module.css";
import { elapsedTime } from "../../elapsedTime";

import { BsThreeDots } from "react-icons/bs";

const FeedComment = ({ comment, onDeleteCmt }) => {
  // Redux store에서 현재 로그인한 사용자의 데이터를 가져오기
  const userData = useSelector((state) => state.user.userData);
  // 댓글 작성자
  const [writerId, setWriterId] = useState("");
  // 옵션 메뉴
  const optionsRef = useRef(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  // 현재 사용자와 댓글의 작성자가 일치하는지 확인
  // -> 일치하면 옵션 보이기 (삭제 가능), 불일치하면 옵션 숨기기
  // DB에서 댓글 작성자 ID 가져오기
  const fetchWriter = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8089/wefam/get-comment/${comment.cmtIdx}`
      );
      setWriterId(response.data.userId);
    } catch (error) {
      console.error("댓글 정보 요청 에러:", error);
    }
  }, [comment.cmtIdx]);

  // 옵션
  const toggleOptions = useCallback(() => {
    if (!isOptionsVisible) {
      fetchWriter(); // 옵션이 처음 열릴 때만 작성자 아이디를 가져옴
    }
    setIsOptionsVisible((prev) => !prev);
  }, [isOptionsVisible, fetchWriter]);

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

  // 댓글 삭제 요청!
  const deleteCmt = async () => {
    try {
      if (userData.id === writerId) {
        await axios.delete(
          `http://localhost:8089/wefam/delete-comment/${comment.cmtIdx}`
        );
        // 부모 컴포넌트에 삭제된 댓글 ID를 전달! (삭제된 댓글을 제외한 댓글들 리렌더링)
        onDeleteCmt(comment.cmtIdx);
        console.log("댓글 삭제 완료");
      } else {
        alert("댓글 삭제 중에 오류가 발생하였습니다. 삭제 권한이 없습니다.");
      }
    } catch (error) {
      console.error("deleteCmt 함수 에러 : ", error);
    }
  };

  // 댓글 삭제 클릭!
  const handleDeleteCmt = async () => {
    if (window.confirm(`${comment.cmtIdx}번 댓글을 삭제하시겠습니까?`)) {
      await fetchWriter();
      await deleteCmt();
    }
  };

  return (
    <li className={styles.cmt}>
      <div className={styles.cmtProfile}>
        <img
          className={styles.cmtProfileImg}
          src={comment.profileImg}
          alt='Profile'
        />
      </div>
      <div className={styles.cmtMain}>
        <div className={styles.cmtMeta}>
          <div>
            <span className={styles.cmtNick}>{comment.nick}</span>
            <span className={styles.cmtTime}>
              {elapsedTime(comment.postedAt)}
            </span>
          </div>
          {userData.id === comment.userId && (
            <div
              onClick={toggleOptions}
              ref={optionsRef}
              className={styles.optionsContainer}>
              <BsThreeDots />
              {isOptionsVisible && (
                <ul className={styles.options}>
                  <li>
                    <button className='option' onClick={handleDeleteCmt}>
                      삭제
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        <div className={styles.cmtContent}>{comment.cmtContent}</div>
      </div>
    </li>
  );
};

export default FeedComment;
