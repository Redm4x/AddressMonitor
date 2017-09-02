import * as React from "react";

import { Map, List, fromJS } from "immutable";
import axios from "axios";
import { FormattedRelative } from "react-intl";

require('bootstrap/dist/js/bootstrap');

const queryString = require('query-string');

const supportedCoins = fromJS([
  {
    title: "Bitcoin",
    code: "BTC",
  }
]);

interface IAppProps {

}

interface IAppState {
  addresses: List<Map<string, any>>;
  currentAddress: string;
}

export default class Main extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      addresses: List<Map<string, any>>(),
      currentAddress: "",
    };
  }

  componentWillMount() {
    this.loadAddresses();
  }

  loadAddresses = () => {
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
      
      this.setState({
        addresses: addresses
      });

      this.loadBalances(addresses);
    }
  }

  loadBalances = (addresses: List<Map<string,any>>) => {
    const url = "https://blockchain.info/balance?active=" + addresses.map(a => a.get("address")).toArray().join("|") + "&cors=true";
    
    axios.get(url).then(response => {
      let result = fromJS(response.data);
      let newAddresses = this.state.addresses.map(address => {
        return address.set("balance", result.getIn([address.get("address"), "final_balance"]))
          .set("isLoading", false);
      }).toList();

      this.setState({
        addresses: newAddresses
      });
    });
  }

  handleCurrentAddressChange = (e) => {
    this.setState({
      currentAddress: e.target.value
    });
  }

  addAddress = () => {
    window.location.href = window.location.pathname + "?addrs=btc:" + this.state.currentAddress;
  }

  render() {
    const { } = this.props;

    let currentCoin = supportedCoins.first();

    let addresses = this.state.addresses.map(current => {
      return <tr key={current.get("address")}>
        <td>{current.get("address")}</td>
        <td>{current.getIn(["coin", "code"])}</td>
        <td>
          {current.get("isLoading")
            ? <i className="fa fa-spinner fa-spin fa-fw"></i>
            : <span>{current.get("balance") / 100000000}</span>
          }
        </td>
      </tr>;
    }).toList();

    let coinList = supportedCoins.map(c => {
      return <li key={c.get("code")}><a className="dropdown-item" href="#">{c.get("code")}</a></li>;
    });

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <h1 className="pageTitle">Address Monitor</h1>
            <div className="input-group">
              <div className="input-group-btn">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {currentCoin.get("code")} <span className="caret"></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-left">
                  {coinList}
                </ul>
              </div>
              <input type="text" className="form-control" onChange={this.handleCurrentAddressChange} placeholder="Enter address (ex : 14giKmNzVRSognpmievyqgt9JeT5tPdmfr)" />
              {/* FOR TESTING : 12E5AiZ2rDRRgnnLr7mqJ1eRfjhqAaHC3Z */}
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={() => this.addAddress()}>Check</button>
              </span>
            </div>
            <br />
            {!addresses.isEmpty() && (
              <table className="table packagesTable">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Coin</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}