import { ANALYTIC_REPORT_ALL_GET } from "../actions/types";

const initialState = { snapshot: null };

export default function(state = initialState, action) {
  switch (action.type) {
    case ANALYTIC_REPORT_ALL_GET:
      return {
        ...state,
        snapshot: action.payload
      };
    default:
      return initialState;
  }
}
