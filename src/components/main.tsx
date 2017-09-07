import * as React from "react";
import { connect } from "react-redux";

import { Map, List, fromJS } from "immutable";
import { loadAddresses, loadPrices, computePrices, updateCurrentAddress } from "../actions/actions";
import { supportedCoins } from "../utils/contants";
import { TrackedAddressRow } from "./trackedAddressRow";

require('bootstrap/dist/js/bootstrap.min');

interface IAppProps {
  addresses: List<Map<string, any>>;
  currentAddress: string;

  loadAddresses: () => Promise<void>;
  loadPrices: () => Promise<void>;
  computePrices: () => void;
  updateCurrentAddress: (newAddress: string) => void;
}

export class Main extends React.Component<IAppProps, void> {
  constructor(props: IAppProps) {
    super(props);
  }

  componentWillMount() {
    let addressLoading = this.props.loadAddresses();
    let priceLoading = this.props.loadPrices();

    Promise.all([addressLoading, priceLoading]).then(() => {
      this.props.computePrices();
    });
  }

  handleCurrentAddressChange = (e) => {
    this.props.updateCurrentAddress(e.target.value)
  }

  addAddress = () => {
    window.location.href = window.location.pathname + "?addrs=btc:" + this.props.currentAddress;
  }

  render() {
    const { addresses, currentAddress } = this.props;

    let currentCoin = supportedCoins.first();

    let addressList = addresses.map(current => {
      return <TrackedAddressRow key={current.get("address")} trackedAddress={current} />
    }).toList();

    let coinList = supportedCoins.map(c => {
      return <li key={c.get("code")}><a className="dropdown-item" href="#">{c.get("code")}</a></li>;
    });

    const donateAddress = "12E5AiZ2rDRRgnnLr7mqJ1eRfjhqAaHC3Z";

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
              <input type="text" value={currentAddress} className="form-control" onChange={this.handleCurrentAddressChange} placeholder={`Enter address (ex : ${donateAddress})`} />
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
                    <th>Price (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {addressList}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    addresses: state.get("addresses"),
    currentAddress: state.get("currentAddress"),
  }
}

export default connect(mapStateToProps, {
  loadAddresses,
  loadPrices,
  computePrices,
  updateCurrentAddress,
})(Main);