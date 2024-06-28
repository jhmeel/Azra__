/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLEAR_ERRORS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  SIGNUP_FAIL,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  FETCH_DASHBOARD_FAIL,
  FETCH_DASHBOARD_REQUEST,
  FETCH_DASHBOARD_SUCCESS,
  UPDATE_PING_FAIL,
  UPDATE_PING_REQUEST,
  UPDATE_PING_SUCCESS,
  DELETE_PING_FAIL,
  DELETE_PING_REQUEST,
  DELETE_PING_SUCCESS,
  FETCH_HOSPITALS_FAIL,
  FETCH_HOSPITALS_REQUEST,
  FETCH_HOSPITALS_SUCCESS,
  DELETE_HOSPITAL_FAIL,
  DELETE_HOSPITAL_REQUEST,
  DELETE_HOSPITAL_SUCCESS,
  GET_ACTIVE_CHATS_FAIL,
  GET_ACTIVE_CHATS_REQUEST,
  GET_ACTIVE_CHATS_SUCCESS,
  GET_CHAT_HISTORY_FAIL,
  GET_CHAT_HISTORY_REQUEST,
  GET_CHAT_HISTORY_SUCCESS,
  NEW_PING_REQUEST,
  NEW_PING_SUCCESS,
  NEW_PING_FAIL,
} from "../constants";
import { Action, Coordinate, NearbySearchProp, Ping, PingUpdateProp, Role, SignupFormData } from "../types";
import axiosInstance from "../utils/axiosInstance";
import { errorParser } from "../utils/formatter";

// Login
export const login =
  (credentials: { email: string; password: string }, isHospital: boolean) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const endpoint = isHospital
        ? "/api/v1/auth/h/login"
        : "/api/v1/auth/p/login";
      const { data } = await axiosInstance().post(endpoint, credentials);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Signup
export const signup =
  (credentials: SignupFormData, isHospital: boolean) =>
  async (dispatch: (action: Action) => void) => {
    try {
      const endpoint = isHospital
        ? "/api/v1/auth/h/signup"
        : "/api/v1/auth/p/signup";
      dispatch({ type: SIGNUP_REQUEST });
      const { data } = await axiosInstance().post(endpoint, credentials);
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SIGNUP_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Fetch Dashboard
export const fetchDashboard =
  (role: Role, token?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: FETCH_DASHBOARD_REQUEST });
      const { data } = await axiosInstance(token, role).get(
        "/api/v1/dashboard"
      );
      dispatch({
        type: FETCH_DASHBOARD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_DASHBOARD_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update Ping
export const updatePing =
  (token?: string, pingId?: string, pingData?: PingUpdateProp) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: UPDATE_PING_REQUEST });
      const { data } = await axiosInstance(token,Role.HOSPITAL).put(
        `/api/v1/ping/${pingId}`,
        pingData
      );
      dispatch({
        type: UPDATE_PING_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PING_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const newPing =
  (token?: string, pingData?: Ping) =>
  async (dispatch: (action: Action) => void) => {
    try {

      dispatch({ type: NEW_PING_REQUEST });
      const { data } = await axiosInstance(token,Role.PATIENT).post(
        `/api/v1/ping`,
        pingData
      );
      dispatch({
        type: NEW_PING_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_PING_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Delete Ping
export const deletePing =
  (token?: string, hospitalId?: string, pingId?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: DELETE_PING_REQUEST });
      const { data } = await axiosInstance(token,Role.HOSPITAL).delete(
        `/api/v1/hospital/${hospitalId}/ping/${pingId}`
      );
      dispatch({
        type: DELETE_PING_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_PING_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Fetch Hospitals
export const fetchNearByHospitals =
  (token?: string, searchProp?:NearbySearchProp) => async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: FETCH_HOSPITALS_REQUEST });
      const { data } = await axiosInstance(token).post("/api/v1/hospitals/nearby", searchProp);
      dispatch({
        type: FETCH_HOSPITALS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_HOSPITALS_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Delete Hospitals
export const deleteHospitals =
  (token?: string, hospitalId?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: DELETE_HOSPITAL_REQUEST });
      const { data } = await axiosInstance(token,Role.HOSPITAL).delete(
        `/api/v1/hospital/${hospitalId}`
      );
      dispatch({
        type: DELETE_HOSPITAL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_HOSPITAL_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Get Active Chats
export const getActiveChats =
  (token?: string) => async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: GET_ACTIVE_CHATS_REQUEST });
      const { data } = await axiosInstance(token).get("/api/v1/chats/active");
      dispatch({
        type: GET_ACTIVE_CHATS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_ACTIVE_CHATS_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Get Chat History
export const getChatHistory =
  (token?: string, chatId?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: GET_CHAT_HISTORY_REQUEST });
      const { data } = await axiosInstance(token).get(
        `/api/v1/chats-history/${chatId}`
      );
      dispatch({
        type: GET_CHAT_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_CHAT_HISTORY_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Clear All Errors
export const clearErrors = () => (dispatch: (action: Action) => void) => {
  dispatch({ type: CLEAR_ERRORS });
};
