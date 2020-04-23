import { SET_AUTH_USER, CLEAR_AUTH_USER } from "../constants/actions";

export const initialState = {
  user: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_AUTH_USER: {
      return {
        ...state,
        ...initialState,
      };
    }

    default:
      return state;
  }
};
