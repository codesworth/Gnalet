import { ANALYTIC_REPORT_ALL_GET, REPOPRTS_QUERY } from "../actions/types";

const initialState = { snapshot: null, reports: null };

export default function(state = initialState, action) {
  switch (action.type) {
    case ANALYTIC_REPORT_ALL_GET:
      return {
        ...state,
        snapshot: action.payload
      };

    case REPOPRTS_QUERY:
      return {
        ...state,
        reports: action.payload
      };
    default:
      return initialState;
  }
}
