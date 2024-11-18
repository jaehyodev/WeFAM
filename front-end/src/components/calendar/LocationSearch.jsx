import React, { useState, useEffect } from "react";
import styles from "./LocationSearchInput.module.css"; // CSS 모듈 사용
import Login from "../login/Login";
import { useDispatch } from 'react-redux'; // Redux에서 useDispatch 훅 가져오기
import { setLocationInput } from '../../features/locationSlice'; // 액션 가져오기

const MapSearchInput = ({
  onPlaceSelect,
  event,
  onCoordinatesClear,
  location,
}) => {
  const [searchTerm, setSearchTerm] = useState(event.location || ""); // 초기 location 값을 가져옴
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dispatch = useDispatch(); // Redux dispatch 함수

  useEffect(() => {
    setSearchTerm(location || event.location || ""); // location을 초기값으로 설정하고, location이 변경될 때마다 searchTerm을 업데이트
    console.log(location, event.location);
  }, [location, event.location]);

  useEffect(() => {
    const script = document.createElement("script");
    const api_key = "7e4eb087293f86fae130bfa4231e7f99";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${api_key}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.createElement("div");
        const mapInstance = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        });
        setMap(mapInstance);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleClearLocation = () => {
    setSearchTerm(""); // 입력 필드 초기화
    onCoordinatesClear(); // 좌표 삭제 함수 호출
  };

  // 입력된 검색어가 변경되면 searchTerm 업데이트
  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    console.log(inputValue);

    // Redux로 입력된 값 저장
    dispatch(setLocationInput(inputValue));

    if (inputValue && map) {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(inputValue, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
          setSelectedIndex(-1);
        } else {
          setSearchResults([]);
        }
      });
    } else {
      setSearchResults([]);
    }
  };

  const handlePlaceSelect = (place) => {
    setSearchTerm(place.place_name);
    setSearchResults([]);
    dispatch(setLocationInput(place.place_name)); // redux에 장소 이름 저장
    if (onPlaceSelect) {
      onPlaceSelect(place);

    }
    const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(moveLatLon);
  };

  const handleKeyDown = (e) => {
    if (searchResults.length > 0) {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        handlePlaceSelect(searchResults[selectedIndex]);
      }
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type='text'
        className={styles.customInput} // customInput 클래스를 사용
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder='장소를 입력하세요'
      />
      {searchTerm && (
        <button className={styles.clearButton} onClick={handleClearLocation}>
          &times;
        </button>
      )}
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((place, index) => (
            <li
              key={index}
              onClick={() => handlePlaceSelect(place)}
              className={selectedIndex === index ? styles.selected : ""}>
              <div className={styles.placeName}>{place.place_name}</div>
              <div className={styles.placeAddress}>{place.address_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapSearchInput;
