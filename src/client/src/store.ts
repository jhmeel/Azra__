import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localforage from "localforage";
import {
  chatReducer,
  authReducer,
  dashboardReducer,
  pingReducer,
  hospitalReducer,
} from "./slices";

localforage.config({
  name: "Azra",
  storeName: "state",
  version: 1,
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
});

const persistConfig = {
  key: "root",
  storage: localforage,
  whitelist: ["auth", "dashboard", "ping", "hospital", "chat"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  hospital: hospitalReducer,
  ping: pingReducer,
  chat: chatReducer,
  dashboard: dashboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
