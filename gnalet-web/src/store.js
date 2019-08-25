import { createStore, combineReducers, compose, applyMiddleware } from "redux";

import thunk from "redux-thunk";
import rootReducers from "./reducers/index";

const middleware = [thunk];

const initialState = {};

const store = createStore(
  rootReducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;

//Reducers
//@todo

//react-redux firebase config

/*
const rrfConfig = {
  userProfile: "GN-Authorities",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

//Initialize firebase

firebase.initializeApp(ProjectConfig.default);
const citifirebase = firebase.initializeApp(ProjectConfig.citifm, "citifm");

//Init firestore

const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: NotifyReducer,
  settings: settingReducer,
  fstore: firestoreReducer
});

//Check for settings in local storage

//console.log(localStorage.getItem(USER_SETTINGS));

if (
  localStorage.getItem(USER_SETTINGS) === "undefined" ||
  localStorage.getItem(USER_SETTINGS) === null
) {
  //Default  settings
  const defaultSettings = {
    categories: [],
    region: [],
    access: 0,
    uid: [],
    username: "",
    requiresReload: true
  };

  //Set to local storage

  localStorage.setItem(USER_SETTINGS, JSON.stringify(defaultSettings));
}

//create Initial State
const initialState = {
  //settings: JSON.parse(localStorage.getItem(USER_SETTINGS))
};

//Create store

const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase)
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
*/
