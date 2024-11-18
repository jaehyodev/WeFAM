import React from "react";
import styles from "./SearchResults.module.css"; // CSS 파일 경로

const SearchResults = ({ filteredEvents, onEventClick }) => {
  return (
    <ul
      className={`${styles.searchResults} ${
        filteredEvents.length > 0 ? styles.active : ""
      }`}
    >
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <li key={event.id} onClick={() => onEventClick(event)}>
            <div className={styles.title}>{event.title}</div>
            <div className={styles.date}>
              {new Date(event.start).toLocaleDateString()}{" "}
              {/* 일정 시작일 표시 */}
            </div>
          </li>
        ))
      ) : (
        <li className={styles.noResults}>검색 결과가 없습니다.</li>
      )}
    </ul>
  );
};

export default SearchResults;
