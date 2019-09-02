import backends from "../../backend/firebase";
import {
  ANALYTIC_REPORT_ALL_GET,
  GET_ERRORS,
  REPOPRTS_QUERY,
  DETAILS_REPORT
} from "../types";
import { Duration } from "../../Helpers/Assemblies";
import {
  REF_ANALYTICS,
  DOC_ALL_REPORTS,
  REF_REPORTS,
  FIELD_CATEGORY,
  FIELD_SUPCODE,
  _DATE,
  FIELD_DAY_OF_YEAR,
  QUERY_LIMIT
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

export const fetchReport = (client, options, last) => dispatch => {
  let { category, region, period } = options;
  const pval = parseInt(period, 10);
  const store = backends[client].firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  store.settings = settings;
  let query = null;
  if (category == "All") category = null;
  if (region == "All") region = null;

  if (category && region) {
    query = store
      .collection(`${REF_REPORTS}`)
      .where(FIELD_CATEGORY, "==", category)
      .where(FIELD_SUPCODE, "==", region);
  } else if (category && !region) {
    query = store
      .collection(`${REF_REPORTS}`)
      .where(FIELD_CATEGORY, "==", category);
  } else if (!category && region) {
    query = store
      .collection(`${REF_REPORTS}`)
      .where(FIELD_SUPCODE, "==", region);
  }

  query = matchPeriodQuery(query, pval, store);

  if (last) {
    query.startAfter(last).limit(5);
  } else {
    query.limit(3);
  }
  console.log(query);

  query
    .get()
    .then(querysnap => {
      console.log(querysnap);
      if (querysnap) {
        dispatch({
          type: REPOPRTS_QUERY,
          payload: querysnap
        });
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: { report: "Error Fetching reports" }
      });
    });
};

const matchPeriodQuery = (query, pval, store) => {
  const day = moment().dayOfYear();
  switch (pval) {
    case Duration.today:
      return query
        ? query
            .where(FIELD_DAY_OF_YEAR, "==", day)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT)
        : store
            .collection(`${REF_REPORTS}`)
            .where(FIELD_DAY_OF_YEAR, "==", day)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT);
    case Duration.yesterday:
      return query
        ? query
            .where(FIELD_DAY_OF_YEAR, "==", day - 1)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT)
        : store
            .collection(`${REF_REPORTS}`)
            .where(FIELD_DAY_OF_YEAR, "==", day - 1)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT);
    case Duration.thisWeek:
      const start = day - 6 > 0 ? day - 6 : 1;
      return query
        ? query
            .where(FIELD_DAY_OF_YEAR, ">=", start)
            .where(FIELD_DAY_OF_YEAR, "<=", day)
            .orderBy(FIELD_DAY_OF_YEAR, "desc")
            .limit(QUERY_LIMIT)
        : store
            .collection(`${REF_REPORTS}`)
            .where(FIELD_DAY_OF_YEAR, ">=", start)
            .where(FIELD_DAY_OF_YEAR, "<=", day)
            .orderBy(FIELD_DAY_OF_YEAR, "desc")
            .limit(QUERY_LIMIT);

    case Duration.thisMonth:
      const mstart = day - 29 > 1 ? day - 29 : 1;
      return query
        ? query
            .where(FIELD_DAY_OF_YEAR, ">=", mstart)
            .where(FIELD_DAY_OF_YEAR, "<=", day)
            .orderBy(FIELD_DAY_OF_YEAR, "desc")
            .limit(QUERY_LIMIT)
        : store
            .collection(`${REF_REPORTS}`)
            .where(FIELD_DAY_OF_YEAR, ">=", mstart)
            .where(FIELD_DAY_OF_YEAR, "<=", day)
            .orderBy(FIELD_DAY_OF_YEAR, "desc")
            .limit(QUERY_LIMIT);

    case Duration.thisYear:
      const year = moment().year();
      return query
        ? query
            .where("year", "==", year)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT)
        : store
            .collection(`${REF_REPORTS}`)
            .query.where("year", "==", year)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT);
    default:
      return query
        ? query.orderBy(_DATE).limit(QUERY_LIMIT)
        : store
            .collection(`${REF_REPORTS}`)
            .orderBy(_DATE, "desc")
            .limit(QUERY_LIMIT);
      break;
  }
};

export const detailsFor = report => dispatch => {
  if (report) {
    dispatch({
      type: DETAILS_REPORT,
      payload: report
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: { report: "Error unknown" }
    });
  }
};
