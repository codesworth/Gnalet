import { combineReducers } from "redux";
import authReducers from "./authReducer";
import firestoreReducer from "./firestoreReducers";
import errorReducer from "./errorReducers";
import reportReducer from "./repoortReducer";

export default combineReducers({
  auth: authReducers,
  store: firestoreReducer,
  errors: errorReducer,
  reports: reportReducer
});
