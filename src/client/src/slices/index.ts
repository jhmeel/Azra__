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
  NEW_PING_FAIL,
  NEW_PING_REQUEST,
  NEW_PING_SUCCESS,
  NEW_PING_RESET,
  UPDATE_PING_RESET,
  DELETE_PING_RESET,
  SET_SELECTED_CHAT,
  SET_MESSAGES,
  GET_HOSPITAL_CHAT_HISTORY_REQUEST,
  GET_HOSPITAL_CHAT_HISTORY_SUCCESS,
  GET_HOSPITAL_CHAT_HISTORY_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_FAIL,
  SEND_MESSAGE_RESET,
  CREATE_REVIEW_RESET,
  UPDATE_REVIEW_RESET,
  DELETE_REVIEW_RESET,
  UPDATE_HOSPITAL_PROFILE_REQUEST,
  UPDATE_HOSPITAL_PASSWORD_REQUEST,
  UPDATE_HOSPITAL_PROFILE_SUCCESS,
  UPDATE_HOSPITAL_PASSWORD_SUCCESS,
  UPDATE_HOSPITAL_PROFILE_FAIL,
  UPDATE_HOSPITAL_PASSWORD_FAIL,
  UPDATE_HOSPITAL_PROFILE_RESET,
  UPDATE_HOSPITAL_PASSWORD_RESET,
  DELETE_CHAT_REQUEST,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAIL,
  UPDATE_PATIENT_PROFILE_REQUEST,
  UPDATE_PATIENT_PASSWORD_REQUEST,
  UPDATE_PATIENT_PROFILE_SUCCESS,
  UPDATE_PATIENT_PASSWORD_SUCCESS,
  UPDATE_PATIENT_PROFILE_RESET,
  UPDATE_PATIENT_PASSWORD_RESET,
  UPDATE_PATIENT_PROFILE_FAIL,
  UPDATE_PATIENT_PASSWORD_FAIL,
} from "../constants";
import { Action, Hospital, Message, Patient } from "../types";

interface AuthState {
  loading: boolean;
  user: Patient | Hospital | null;
  role: string | null;
  error: string | null;
  accessToken: string | null;
}

const initialAuthState: AuthState = {
  loading: false,
  user: null,
  role: null,
  error: null,
  accessToken: null,
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
  hospitals: [],
  message: null,
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
        user: action.payload.user,
        role: action.payload.role,
        accessToken: action.payload.accessToken,
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
        dashboard: action.payload?.dashboard,
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
        pings: action.payload?.pings,
        message: action.payload?.message,
      };
    case NEW_PING_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload?.message,
      };

    case DELETE_PING_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload?.message,
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
const initialProfileState ={
loading: false,
message:null,
error: null,
}

const profileReducer = (state = initialProfileState, action: Action) => {
  switch (action.type) {
      case UPDATE_PATIENT_PROFILE_REQUEST:
        case UPDATE_PATIENT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true
      }
      case UPDATE_PATIENT_PROFILE_SUCCESS:
        case UPDATE_PATIENT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message
      };

      case UPDATE_PATIENT_PROFILE_FAIL:
        case UPDATE_PATIENT_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case UPDATE_PATIENT_PROFILE_RESET:
        case UPDATE_PATIENT_PASSWORD_RESET:
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


// Hospital reducer
const hospitalReducer = (state = initialHospitalState, action: Action) => {
  switch (action.type) {
    case FETCH_HOSPITALS_REQUEST:
    case DELETE_HOSPITAL_REQUEST:
    case UPDATE_HOSPITAL_PROFILE_REQUEST:
    case UPDATE_HOSPITAL_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_HOSPITALS_SUCCESS:
      return {
        ...state,
        loading: false,
        hospitals: action.payload?.hospitals,
      };
    case UPDATE_HOSPITAL_PROFILE_SUCCESS:
    case UPDATE_HOSPITAL_PASSWORD_SUCCESS:
    case DELETE_HOSPITAL_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };

    case FETCH_HOSPITALS_FAIL:
    case DELETE_HOSPITAL_FAIL:
    case UPDATE_HOSPITAL_PROFILE_FAIL:
    case UPDATE_HOSPITAL_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_HOSPITAL_RESET:
    case UPDATE_HOSPITAL_PROFILE_RESET:
    case UPDATE_HOSPITAL_PASSWORD_RESET:
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

interface IInitialChatStateProp {
  loading: boolean;
  hospital: Hospital | null;
  activeChats: Hospital[] | null;
  chatHistory: any[];
  selectedChat: Hospital | null;
  message_sent_success: boolean | null;
  error: string | null;
}
const initialChatState: IInitialChatStateProp = {
  loading: false,
  hospital: null,
  activeChats: [],
  chatHistory: [],
  selectedChat: null,
  message_sent_success: null,
  error: null,
};

const chatReducer = (state = initialChatState, action: Action) => {
  switch (action.type) {
    case GET_ACTIVE_CHATS_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case GET_HOSPITAL_CHAT_HISTORY_REQUEST:
    case DELETE_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        chatHistory: state.chatHistory ? [...state.chatHistory, action.payload.message] : [action.payload.message],
        message_sent_success: true,
        loading: false,
      };
    case DELETE_CHAT_SUCCESS:
      return {
        loading: false,
        chatHistory: state.chatHistory?.filter(msg => msg._id !== action.payload.messageId),
      };
    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        message_sent_success: false,
        loading: false,
        error: action.payload,
      };
    case SEND_MESSAGE_RESET:
      return {
        ...state,
        message_sent_success: null,
        loading: false,
      };

    case GET_ACTIVE_CHATS_SUCCESS:
      return {
        ...state,
        loading: false,
        activeChats: action.payload?.hospitals,
      };

    case GET_HOSPITAL_CHAT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        chatHistory: action.payload,
      };
    case SET_SELECTED_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...state,
        chatHistory: action.payload,
      };

    case GET_ACTIVE_CHATS_FAIL:
    case GET_HOSPITAL_CHAT_HISTORY_FAIL:
    case DELETE_CHAT_FAIL:
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

const initialReviewState = {
  loading: false,
  message: null,
  error: null,
};

const reviewReducer = (state = initialReviewState, action: Action) => {
  switch (action.type) {
    case CREATE_REVIEW_REQUEST:
    case DELETE_REVIEW_REQUEST:
    case UPDATE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_REVIEW_SUCCESS:
    case UPDATE_REVIEW_SUCCESS:
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };

    case CREATE_REVIEW_FAIL:
    case DELETE_REVIEW_FAIL:
    case UPDATE_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_REVIEW_RESET:
    case UPDATE_REVIEW_RESET:
    case DELETE_REVIEW_RESET:
      return {
        ...state,
        loading: false,
        error: null,
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

export {
  authReducer,
  dashboardReducer,
  pingReducer,
  reviewReducer,
  profileReducer,
  hospitalReducer,
  chatReducer,
};
