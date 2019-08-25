import { AUTH_DISPATCH, LOGOUT_DISPATCH } from "../actions/types";
import {
  retrieveState,
  saveAuthState,
  invalidateAuthState
} from "../actions/Persistence";

const initialState = retrieveState()
  ? retrieveState()
  : {
      isAuthenticated: false,
      user: null
    };

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_DISPATCH:
      const authsate = { user: action.payload, isAuthenticated: true };
      saveAuthState(authsate);
      return authsate;
    case LOGOUT_DISPATCH:
      invalidateAuthState();
      return {
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
}
