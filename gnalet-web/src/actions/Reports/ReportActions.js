import backends from "../backend/firebase";
import { ANALYTIC_REPORT_ALL_GET } from "./types";
import { Duration } from "../Helpers/Assemblies";
import { REF_ANALYTICS, REF_ANALYTICS_YEAR, REF_ANALYTICS_DAY_OF_YEAR } from "../Helpers/Constants";
import moment = require("moment");

const getRportAnalytics = (client, options) => dispatch => {
  const store = backends[client].firestore();

  const { category, region,duration } = options;
  let query = null
  if (category && region){
      const newDuration = Duration[duration]
      const year = moment().year()
    if (newDuration){
      switch (newDuration){
        case Duration.today:
          const day = moment().dayOfYear()
          query = store.doc(`${REF_ANALYTICS}/${region}/${REF_ANALYTICS_YEAR}/${year}/${REF_ANALYTICS_DAY_OF_YEAR}/${day}`)
      }
    }
  }
};
