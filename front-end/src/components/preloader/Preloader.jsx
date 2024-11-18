import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Preloader.module.css";

const Preloader = ({ isLoading }) => {
  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return ReactDOM.createPortal(
    <div className={styles.mask}>
      <div className={styles.spinner}></div>
    </div>,
    document.body
  );
};

export default Preloader;
