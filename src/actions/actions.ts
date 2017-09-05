import * as types from "../actions/actionTypes";
import { List, Map, fromJS } from "immutable";
import axios from "axios";
import { Dispatch } from "redux";
import { supportedCoins } from "../utils/contants";

const queryString = require('query-string');

export function loadAddresses() {
  return (dispatch: Dispatch<any>, getState) => {
    const params = queryString.parse(window.location.search);

    if (params && params.addrs) {
      let addresses = List([]);
      let addrs = params.addrs.split(",");

      for (let i = 0; i < addrs.length; i++) {
        const parts = addrs[i].split(":");
        const coin = supportedCoins.find(c => c.get("code").toUpperCase() == parts[0].toUpperCase());

        if (coin) {
          addresses = addresses.push(Map({
            address: parts[1],
            coin: coin,
            isLoading: true,
          }));
        }
      }

      dispatch({
        type: types.UPDATE_ADDRESSES,
        addresses,
      });

      dispatch(loadBalances());
    }
  }
}

function loadBalances() {
  return (dispatch: Dispatch<any>, getState) => {

    const addresses = getState().get("addresses");
    const url = "https://blockchain.info/balance?active=" + addresses.map(a => a.get("address")).toArray().join("|") + "&cors=true";

    axios.get(url).then(response => {
      let result = fromJS(response.data);
      let newAddresses = getState().get("addresses").map(address => {
        return address.set("balance", result.getIn([address.get("address"), "final_balance"]))
          .set("isLoading", false);
      }).toList();

      dispatch({
        type: types.UPDATE_ADDRESSES,
        addresses: newAddresses,
      });
    });
  }
}


export function loadPrices() {
  return (dispatch: Dispatch<any>, getState) => {

  }
}