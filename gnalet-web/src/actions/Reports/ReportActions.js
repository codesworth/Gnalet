import backends from "../../backend/firebase";
import { ANALYTIC_REPORT_ALL_GET, GET_ERRORS } from "../types";
import { Duration } from "../../Helpers/Assemblies";
import {
  REF_ANALYTICS,
  REF_ANALYTICS_YEAR,
  REF_ANALYTICS_DAY_OF_YEAR
} from "../../Helpers/Constants";
import * as moment from "moment";

export const getRportAnalytics = client => dispatch => {
  const store = backends[client].firestore();
  const year = moment().year();
  const yearRef = store.doc(`${REF_ANALYTICS}/${year}`);
  yearRef
    .get()
    .then(data => {
      dispatch({
        type: ANALYTIC_REPORT_ALL_GET,
        payload: data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: { report: "Unable to Fetch Data" }
      });
    });
};
