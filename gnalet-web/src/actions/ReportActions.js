import backends from "../backend/firebase";
import { ANALYTIC_REPORT_ALL_GET } from "./types";

const getRportAnalytics = (client, options) => dispatch => {
  const store = backends[client].firestore();

  const { category, region } = options;
};
