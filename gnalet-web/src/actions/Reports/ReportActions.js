import backends from "../../backend/firebase";
import { ANALYTIC_REPORT_ALL_GET, GET_ERRORS, REPOPRTS_QUERY } from "../types";
import { Duration } from "../../Helpers/Assemblies";
import {
  REF_ANALYTICS,
  REF_ANALYTICS_YEAR,
  REF_ANALYTICS_DAY_OF_YEAR,
  DOC_ALL_REPORTS,
  REF_REPORTS,
  FIELD_CATEGORY,
  FIELD_SUPCODE,
  _DATE
} from "../../Helpers/Constants";
import * as moment from "moment";

export const getRportAnalytics = (client, allTime = false) => dispatch => {
  const store = backends[client].firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  store.settings = settings;

  //console.log(`Backend key is: ${client}`);
  let ref = null;
  if (allTime) {
    ref = store.doc(`${REF_ANALYTICS}/${DOC_ALL_REPORTS}`);
  } else {
    const year = moment().year();
    ref = store.doc(`${REF_ANALYTICS}/${year}`);
  }

  ref
    .get()
    .then(data => {
      //console.log(`Got data: ${data.data()["242"]}`);

      dispatch({
        type: ANALYTIC_REPORT_ALL_GET,
        payload: data
      });
    })
    .catch(err => {
      console.log(`Error occurred fetching analytics: ${err}`);

      dispatch({
        type: GET_ERRORS,
        payload: { report: "Unable to Fetch Data" }
      });
    });
};

export const fetchReport = (client, options) => dispatch => {
  const { category, region, last } = options;
  const store = backends[client].firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  store.settings = settings;
  let query = null;
  if (category && region) {
    query = store
      .doc(`${REF_REPORTS}`)
      .where(FIELD_CATEGORY, "==", category)
      .where(FIELD_SUPCODE, "==", region);
  } else if (category && !region) {
    query = store
      .doc(`${REF_REPORTS}`)
      .where(FIELD_CATEGORY, "==", category)
      .orderBy(_DATE);
  } else if (!category && region) {
    query = store
      .doc(`${REF_REPORTS}`)
      .where(FIELD_SUPCODE, "==", region)
      .orderBy(_DATE);
  } else {
    query = store.doc(`${REF_REPORTS}`).orderBy(_DATE);
  }
  if (last) {
    query.startAfter(last).limit(20);
  }
  query
    .onSnapshot()
    .then(data => {
      if (data) {
        dispatch({
          type: REPOPRTS_QUERY,
          payload: data
        });
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: { report: "Error with Query Fetch: " + err }
      });
    });
};
