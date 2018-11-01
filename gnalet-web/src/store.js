import {
    createStore,
    combineReducers,
    compose
} from 'redux'
import firebase from 'firebase'
import 'firebase/firestore'
import {
    reactReduxFirebase,
    firebaseReducer
} from 'react-redux-firebase';
import {
    reduxFirestore,
    firestoreReducer
} from 'redux-firestore'
import NotifyReducer from './reducers/NotifyReducer'
import settingReducer from './reducers/settingReducer';
import { USER_SETTINGS } from './Helpers/Constants';
//Reducers
//@todo

const config = {
    apiKey: "AIzaSyDK06vnoYsjRLRbZKsKd4zpS72SbVydXqg",
    authDomain: "gnalet-e91c4.firebaseapp.com",
    databaseURL: "https://gnalet-e91c4.firebaseio.com",
    projectId: "gnalet-e91c4",
    storageBucket: "gnalet-e91c4.appspot.com",
    messagingSenderId: "1026593999626"
}


//react-redux firebase config

const rrfConfig = {
    userProfile: 'GN-Authorities',
    useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

//Initialize firebase

firebase.initializeApp(config);

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
    settings: settingReducer
})


//Check for settings in local storage

//console.log(localStorage.getItem(USER_SETTINGS));

if (localStorage.getItem(USER_SETTINGS) === 'undefined' || localStorage.getItem(USER_SETTINGS) === null) {
    //Default  settings
    const defaultSettings = {
        categories: [],
        region: [],
        access:0,
        uid: [],
        username:'',
        requiresReload:true
    }

    //Set to local storage


    localStorage.setItem(USER_SETTINGS, JSON.stringify(defaultSettings));
}

//create Initial State 
const initialState = {
    settings: JSON.parse(localStorage.getItem(USER_SETTINGS))
};


//Create store

const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;