import backends from "../backend/firebase";
import { AUTH_DISPATCH, LOGOUT_DISPATCH, GET_ERRORS } from "./types";
import { REF_GNALET_CLIENT } from "../Helpers/Constants";

const auth = backends.default.auth();
const store = backends.default.firestore();
const settings = {
  timestampsInSnapshots: true
};
store.settings = settings;

export const login = data => dispatch => {
  const { email, password } = data;
  auth.signInWithEmailAndPassword(email, password).then(credentials => {
    store
      .collection(REF_GNALET_CLIENT)
      .doc(credentials.user.uid)
      .get()
      .then(snap => {
        if (snap.exists) {
          const userdata = snap.data();
          userdata.uid = credentials.user.uid;
          dispatch({
            type: AUTH_DISPATCH,
            payload: userdata
          });
        } else {
          dispatch({
            type: GET_ERRORS,
            payload:
              "User Data Not Found. Please contact Gnalet Management Team"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: { email: "Invalid user login details" }
        });
      });
  });
};

export const logout = () => dispatch => {
  auth
    .signOut()
    .then(x => {
      dispatch({
        type: LOGOUT_DISPATCH,
        payload: {}
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: { error: "Unable to signout. Internal Error" }
      });
    });
};
