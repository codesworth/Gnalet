import * as firebase from "firebase";
import {
  REF_REPORTS,
  _DATE,
  AN_CATEGORICAL,
  FIELD_CATEGORY,
  SANITATION,
  VEHICULAR,
  CRIMES,
  HFDA,
  GSA,
  POTHOLES,
  ECG,
  WATER
} from "../Helpers/Constants";
import { MAPS_GET_LATEST } from "./types";
import accident from "../img/accident2.png";
import crime from "../img/crime.png";
import ecg from "../img/electricity.png";
import health from "../img/health.png";

import others from "../img/others.png";
import gsa from "../img/standard.png";
import pipe from "../img/pipe.png";
import pothole from "../img/pothole.png";
import sanitation from "../img/sanitation.png";

const store = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
store.settings = settings;

export const getlast20Issues = id => dispatch => {
  console.log("I was called");
  store
    .collection(REF_REPORTS)
    .orderBy(_DATE, "desc")
    .limit(20)
    .get()
    .then(bigquery => {
      const markers = [];
      bigquery.docs.forEach(doc => {
        const cat = doc.get(FIELD_CATEGORY);
        const ico = markerIcoForCategory(cat);
        const marker = { ico, report: doc.data() };
        markers.push(marker);
      });
      console.log("These are the issues: " + markers);

      dispatch({ type: MAPS_GET_LATEST, payload: markers });
    })
    .catch(e => {
      console.log("Error occurred: " + e);
    });
};

export const markerIcoForCategory = cat => {
  switch (cat) {
    case SANITATION:
      return sanitation;
    case VEHICULAR:
      return accident;
    case CRIMES:
      return crime;
    case HFDA:
      return health;
    case GSA:
      return gsa;
    case POTHOLES:
      return pothole;
    case ECG:
      return ecg;
    case WATER:
      return pipe;
    default:
      return others;
  }
};

const generateMarkersFromIssues = bigquery => {
  /**
   * Format of an Issue marker:
   * {issue:{},icon:icon}
   */
};
