import { AUTH_DISPATCH, LOGOUT_DISPATCH } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: nil
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_DISPATCH:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case LOGOUT_DISPATCH:
      return {
        initialState
      };
    default:
      return state;
  }
}
