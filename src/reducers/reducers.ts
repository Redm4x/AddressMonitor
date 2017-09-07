import * as types from "../actions/actionTypes";
import {List, Map, fromJS} from "immutable";

const initialState: Map<string, any> = Map({
  addresses: List<Map<string, any>>(),
  prices: Map<string, any>(),
  currentAddress: "",
});

export default function mainReducers(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_ADDRESSES:
      return state.set("addresses", action.addresses);

    case types.UPDATE_PRICES:
      return state.set("prices", action.prices);

    case types.UPDATE_CURRENT_ADDRESS:
      return state.set("currentAddress", action.address);

    default:
      return state;
  }
}