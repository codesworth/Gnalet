import { MAPS_GET_LATEST } from "../actions/types";

const initialState = {
  markers: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MAPS_GET_LATEST:
      return {
        ...state,
        markers: action.payload
      };
    default:
      return state;
  }
}
