import { SET_MESSAGE, CLEAR_MESSAGE } from "../constants/actions";
/**
 * Initial State
 */
export const messageInitialState = {
  content: {
    type: "",
    text: "",
    autoClose: true
  }
};

/**
 * Message Reducer
 */
export const messageReducer = (state = messageInitialState, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        content: {
          type: action.payload.type,
          text: action.payload.text,
          autoClose: action.payload.autoClose
        }
      };
    case CLEAR_MESSAGE: {
      return {
        ...state,
        ...messageInitialState
      };
    }

    default:
      return state;
  }
};
