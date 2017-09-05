import * as types from "../actions/actionTypes";
import {List, Map, fromJS} from "immutable";

const initialState: Map<string, any> = Map({
  addresses: List<Map<string,any>>(),
});

export default function mainReducers(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_ADDRESSES:
      return state.set("addresses", action.addresses);

    default:
      return state;
  }
}