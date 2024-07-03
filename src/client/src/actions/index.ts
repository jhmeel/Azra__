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
  GET_HOSPITAL_CHAT_HISTORY_FAIL,
  GET_HOSPITAL_CHAT_HISTORY_SUCCESS,
  GET_HOSPITAL_CHAT_HISTORY_REQUEST,
  NEW_PING_REQUEST,
  NEW_PING_SUCCESS,
  NEW_PING_FAIL,
  SET_SELECTED_CHAT,
  SET_MESSAGES,
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_REQUEST,
  UPDATE_PATIENT_PASSWORD_FAIL,
  UPDATE_PATIENT_PASSWORD_SUCCESS,
  UPDATE_PATIENT_PASSWORD_REQUEST,
  UPDATE_PATIENT_PROFILE_REQUEST,
  UPDATE_PATIENT_PROFILE_SUCCESS,
  UPDATE_PATIENT_PROFILE_FAIL,
  UPDATE_HOSPITAL_PASSWORD_FAIL,
  UPDATE_HOSPITAL_PASSWORD_SUCCESS,
  UPDATE_HOSPITAL_PASSWORD_REQUEST,
  UPDATE_HOSPITAL_PROFILE_FAIL,
  UPDATE_HOSPITAL_PROFILE_SUCCESS,
  UPDATE_HOSPITAL_PROFILE_REQUEST,
  UPDATE_REVIEW_FAIL,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_REQUEST,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_REQUEST,
  CREATE_REVIEW_FAIL,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_REQUEST,
  DELETE_CHAT_REQUEST,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAIL,
} from "../constants";
import {
  Action,
  Hospital,
  NearbySearchProp,
  Patient,
  Ping,
  PingUpdateProp,
  Role,
  SignupFormData,
} from "../types";
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
  (token?: string) => async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: FETCH_DASHBOARD_REQUEST });
      const { data } = await axiosInstance(token, Role.HOSPITAL).get(
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
      const { data } = await axiosInstance(token, Role.HOSPITAL).put(
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
      const { data } = await axiosInstance(token, Role.PATIENT).post(
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
      const { data } = await axiosInstance(token, Role.HOSPITAL).delete(
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
  (token?: string, searchProp?: NearbySearchProp) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: FETCH_HOSPITALS_REQUEST });
      const { data } = await axiosInstance(token).post(
        "/api/v1/hospitals/nearby",
        searchProp
      );
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
      const { data } = await axiosInstance(token, Role.HOSPITAL).delete(
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
      const { data } = await axiosInstance(token, Role.HOSPITAL).get(
        "/api/v1/active-chat"
      );
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
export const getHospitalChatHistory =
  (token?: string, chatId?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: GET_HOSPITAL_CHAT_HISTORY_REQUEST });
      const { data } = await axiosInstance(token, Role.HOSPITAL).get(
        `/api/v1/h-chats-history/${chatId}`
      );
      dispatch({
        type: GET_HOSPITAL_CHAT_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_HOSPITAL_CHAT_HISTORY_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const sendMessage =
  (token: string, chatId: string, message: Record<string, string>) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: SEND_MESSAGE_REQUEST });
      const { data } = await axiosInstance(token, Role.HOSPITAL).post(
        `/api/v1/h-message-send/${chatId}`,
        message
      );
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SEND_MESSAGE_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const hpSendMessage =
  (token: string, chatId: string, message: Record<string, string>, role:Role) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: SEND_MESSAGE_REQUEST });
      const { data } = await axiosInstance(token, role).post(
        `/api/v1/p-message-send/${chatId}`,
        message
      );
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SEND_MESSAGE_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const getHPChatHistory =
  (token?: string, chatId?: string, role?:Role) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: GET_HOSPITAL_CHAT_HISTORY_REQUEST });
      const { data } = await axiosInstance(token, role).get(
        `/api/v1/p-chats-history/${chatId}`
      );
      dispatch({
        type: GET_HOSPITAL_CHAT_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_HOSPITAL_CHAT_HISTORY_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const deleteMessage =   (token?: string, conversationId?: string, messageId?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: DELETE_CHAT_REQUEST });
      const { data } = await axiosInstance(token, Role.HOSPITAL).delete(
        `/api/v1/p-message/delete`,
        {
          conversationId,
          messageId,
        }
      );
      dispatch({
        type: DELETE_CHAT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_CHAT_FAIL,
        payload: errorParser(error),
      });
    }

};

export const hpDeleteMessage =
  (token?: string, conversationId?: string, messageId?: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: DELETE_CHAT_REQUEST });
      const { data } = await axiosInstance(token, Role.HOSPITAL).delete(
        `/api/v1/p-message/delete`,
        {
          conversationId,
          messageId,
        }
      );
      dispatch({
        type: DELETE_CHAT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_CHAT_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const setSelectedChat = (chat?: Hospital) => ({
  type: SET_SELECTED_CHAT,
  payload: chat,
});

export const setMessages = (messages: any[]) => ({
  type: SET_MESSAGES,
  payload: messages,
});

// Create Review
export const createReview =
  (token: string, hospitalId: string, reviewData: any) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: CREATE_REVIEW_REQUEST });
      const { data } = await axiosInstance(token, Role.PATIENT).post(
        `/api/v1//new-review/${hospitalId}`,
        reviewData
      );
      dispatch({
        type: CREATE_REVIEW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_REVIEW_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Delete Review
export const deleteReview =
  (token: string, reviewId: string) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: DELETE_REVIEW_REQUEST });
      await axiosInstance(token, Role.PATIENT).delete(
        `/api/v1/reviews/${reviewId}`
      );
      dispatch({
        type: DELETE_REVIEW_SUCCESS,
        payload: reviewId,
      });
    } catch (error) {
      dispatch({
        type: DELETE_REVIEW_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update Review
export const updateReview =
  (token: string, reviewId: string, reviewData: any) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: UPDATE_REVIEW_REQUEST });
      const { data } = await axiosInstance(token, Role.PATIENT).put(
        `/api/v1/reviews/${reviewId}`,
        reviewData
      );
      dispatch({
        type: UPDATE_REVIEW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_REVIEW_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update Hospital Profile
export const updateHospitalProfile =
  (token: string, hospitalId: string, profileData: any) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: UPDATE_HOSPITAL_PROFILE_REQUEST });
      const { data } = await axiosInstance(token, Role.PATIENT).put(
        `/api/v1/profile/h/${hospitalId}`,
        profileData
      );
      dispatch({
        type: UPDATE_HOSPITAL_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_HOSPITAL_PROFILE_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update Hospital Password
export const updatePasswordHospital =
  (token: string, hospitalId: string, passwordData: any) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: UPDATE_HOSPITAL_PASSWORD_REQUEST });
      const { data } = await axiosInstance(token, Role.HOSPITAL).put(
        `/api/v1/password/h/${hospitalId}`,
        passwordData
      );
      dispatch({
        type: UPDATE_HOSPITAL_PASSWORD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_HOSPITAL_PASSWORD_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update Patient Profile
export const updatePatientProfile =
  (token: string, patientId: string, profileData: any) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: UPDATE_PATIENT_PROFILE_REQUEST });
      const { data } = await axiosInstance(token, Role.PATIENT).put(
        `/api/v1/profile/p/${patientId}`,
        profileData
      );
      dispatch({
        type: UPDATE_PATIENT_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PATIENT_PROFILE_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update Patient Password
export const updatePasswordPatient =
  (token: string, patientId: string, passwordData: any) =>
  async (dispatch: (action: Action) => void) => {
    try {
      dispatch({ type: UPDATE_PATIENT_PASSWORD_REQUEST });
      const { data } = await axiosInstance(token, Role.PATIENT).put(
        `/api/v1/password/p/${patientId}`,
        passwordData
      );
      dispatch({
        type: UPDATE_PATIENT_PASSWORD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PATIENT_PASSWORD_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Clear All Errors
export const clearErrors = () => (dispatch: (action: Action) => void) => {
  dispatch({ type: CLEAR_ERRORS });
};
