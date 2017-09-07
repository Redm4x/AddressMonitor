import * as types from "../actions/actionTypes";
import { List, Map, fromJS } from "immutable";
import axios from "axios";
import { Dispatch } from "redux";
import { supportedCoins } from "../utils/contants";
import * as btcHelpers from "../utils/btcHelpers";

const queryString = require('query-string');

export function loadAddresses() {
  return (dispatch: Dispatch<any>, getState) => {
    const params = queryString.parse(window.location.search);

    let addresses = List([]);

    Object.keys(params).forEach(key => {
      let coin = supportedCoins.find(c => c.get("code") == key.toUpperCase());

      if (coin) {
        let addrs = params[key].split(",");

        for (let i = 0; i < addrs.length; i++) {
          const addr = addrs[i];

          if (addresses.some(x => x.get("address") == addr)) continue; // Duplicate

          addresses = addresses.push(Map({
            address: addr,
            coin: coin,
            isLoadingBalance: true,
            isLoadingPrice: true,
          }));
        }
      }
    });

    if (!addresses.isEmpty()) {
      dispatch({
        type: types.UPDATE_ADDRESSES,
        addresses,
      });

      return dispatch(loadBalances());
    }
    else {
      return Promise.resolve();
    }
  }
}

function loadBalances() {
  return (dispatch: Dispatch<any>, getState) => {

    const addresses = getState().get("addresses");
    const url = "https://blockchain.info/balance?active=" + addresses.map(a => a.get("address")).toArray().join("|") + "&cors=true";

    return axios.get(url).then(response => {
      let result = fromJS(response.data);
      let newAddresses = getState().get("addresses").map(address => {
        return address.set("balance", result.getIn([address.get("address"), "final_balance"]) / 100000000)
          .set("isLoadingBalance", false);
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
    const url = "https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=20";

    return axios.get(url).then(response => {
      let result = fromJS(response.data);

      dispatch({
        type: types.UPDATE_PRICES,
        prices: result
      });
    });
  }
}

export function computePrices() {
  return (dispatch: Dispatch<any>, getState) => {

    const addresses = getState().get("addresses");
    const prices = getState().get("prices");

    let newAddresses = addresses.map(addr => {
      return addr.set("price", addr.get("balance") * prices.find(p => p.get("symbol") == addr.getIn(["coin", "code"]))
        .get("price_usd")).set("isLoadingPrice", false);
    });

    dispatch({
      type: types.UPDATE_ADDRESSES,
      addresses: newAddresses,
    });
  }
}

export function updateCurrentAddress(newAddress: string) {
  return {
    type: types.UPDATE_CURRENT_ADDRESS,
    address: newAddress,
  };
}

export function addAddress() {
  return (dispatch: Dispatch<any>, getState) => {
    const addresses = getState().get("addresses");
    let currentAddress = getState().get("currentAddress");

    currentAddress = currentAddress.trim();

    if (btcHelpers.isValidAddress(currentAddress)) {
      let newAddresses = addresses.map(x => x.get("address")).push(currentAddress).reduce((prev, next) => prev + "," + next);
      window.location.href = window.location.pathname + "?btc=" + newAddresses;
    } else {
      dispatch({
        type: types.UPDATE_CURRENT_ADDRESS_ERROR,
        isInvalid: true
      });
    }
  }
}