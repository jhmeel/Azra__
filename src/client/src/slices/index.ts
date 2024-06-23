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
  DELETE_HOSPITAL_RESET,
  DELETE_HOSPITAL_SUCCESS,
  GET_ACTIVE_CHATS_FAIL,
  GET_ACTIVE_CHATS_REQUEST,
  GET_ACTIVE_CHATS_SUCCESS,
  GET_CHAT_HISTORY_FAIL,
  GET_CHAT_HISTORY_REQUEST,
  GET_CHAT_HISTORY_SUCCESS,
  NEW_PING_FAIL,
  NEW_PING_REQUEST,
  NEW_PING_SUCCESS,
  NEW_PING_RESET,
  UPDATE_PING_RESET,
  DELETE_PING_RESET,
} from "../constants";
import { Action} from "../types";

// Initial states
const initialAuthState = {
  loading: false,
  user: null,
  error: null,
};

const initialDashboardState = {
  loading: false,
  dashboard: null,
  error: null,
};

const initialPingState = {
  loading: false,
  pings: [],
  ping: null,
  message: null,
  error: null,
};

const initialHospitalState = {
  loading: false,
  hospitals:[],
  message: null,
  error: null,
};

const initialChatState = {
  loading: false,
  hospital: null,
  activeChats: [],
  chatHistory: [],
  error: null,
};

// Auth reducer
const authReducer = (state = initialAuthState, action: Action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case LOGIN_FAIL:
    case SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Dashboard reducer
const dashboardReducer = (state = initialDashboardState, action: Action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: action.payload,
      };

    case FETCH_DASHBOARD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Ping reducer
const pingReducer = (state = initialPingState, action: Action) => {
  switch (action.type) {
    case UPDATE_PING_REQUEST:
    case NEW_PING_REQUEST:
    case DELETE_PING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_PING_SUCCESS:
      return {
        ...state,
        loading: false,
        pings: action.payload,
      };
    case NEW_PING_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case DELETE_PING_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case UPDATE_PING_FAIL:
    case DELETE_PING_FAIL:
    case NEW_PING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_PING_RESET:
      return {
        ...state,
        loading: false,
        ping: null,
        message: null,
      };
    case UPDATE_PING_RESET:
    case DELETE_PING_RESET:
      return {
        ...state,
        loading: false,
        ping: null,
        message: null,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Hospital reducer
const hospitalReducer = (state = initialHospitalState, action: Action) => {
  switch (action.type) {
    case FETCH_HOSPITALS_REQUEST:
    case DELETE_HOSPITAL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_HOSPITALS_SUCCESS:
      return {
        ...state,
        loading: false,
        hospitals: action.payload,
      };

    case DELETE_HOSPITAL_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case FETCH_HOSPITALS_FAIL:
    case DELETE_HOSPITAL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_HOSPITAL_RESET:
      return {
        ...state,
        loading: false,
        message: null,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Chat reducer
const chatReducer = (state = initialChatState, action: Action) => {
  switch (action.type) {
    case GET_ACTIVE_CHATS_REQUEST:
    case GET_CHAT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_ACTIVE_CHATS_SUCCESS:
      return {
        ...state,
        loading: false,
        hospital: action.payload?.hospital,
        activeChats: action.payload?.activeChats,
      };

    case GET_CHAT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        chatHistory: action.payload,
      };

    case GET_ACTIVE_CHATS_FAIL:
    case GET_CHAT_HISTORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export {
  authReducer,
  dashboardReducer,
  pingReducer,
  hospitalReducer,
  chatReducer,
};
