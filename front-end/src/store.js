// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import leftSidebarReducer from "./features/leftSidebarSlice";
import imagesOnFeedReducer from "./features/imagesOnFeedSlice";
import roulettesReducer from "./features/roulettesSlice";
import pollsReducer from "./features/pollsSlice";
import familyReducer from "./features/familySlice"; // familySlice 추가
import locationInputReducer from "./features/locationSlice"; // locationSlice 추가
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import { thunk } from 'redux-thunk'; // named import로 변경

// persist 설정
const persistConfig = {
  key: "root",
  storage,
};

// rootReducer 설정
const rootReducer = combineReducers({
  user: userReducer,
  leftSidebar: leftSidebarReducer,
  // imagesOnFeed: imagesOnFeedReducer,
  roulettes: roulettesReducer,
  polls: pollsReducer,
  family: familyReducer,
  locationInput: locationInputReducer, // locationReducer 추가
});

// persistReducer로 감싸기
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist와 관련된 직렬화 문제 방지
    }).concat(thunk), // thunk 미들웨어 추가
});

const persistor = persistStore(store);

export { store, persistor };
