import backends from "../../backend/firebase";
import { ANALYTIC_REPORT_ALL_GET, GET_ERRORS } from "../types";
import { Duration } from "../../Helpers/Assemblies";
import {
  REF_ANALYTICS,
  REF_ANALYTICS_YEAR,
  REF_ANALYTICS_DAY_OF_YEAR,
  DOC_ALL_REPORTS
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
