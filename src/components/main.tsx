import * as React from "react";

import { Map, List, fromJS } from "immutable";
import axios from "axios";
import { FormattedRelative } from "react-intl";
import { withRouter } from "react-router-dom";

require('bootstrap/dist/js/bootstrap');

interface IAppProps {
  history: any;
}

interface IAppState {
  addresses: List<Map<string, any>>;
  currentAddress: string;
}

export class Main extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      addresses: List<Map<string, any>>(),
      currentAddress: "",
    };
  }

  handleCurrentAddressChange = (e) => {
    this.setState({
      currentAddress: e.target.value
    });
  }

  addAddress = () => {
    this.props.history.push("/?btc:" + this.state.addresses);
  }

  render() {
    const { } = this.props;

    const supportedCoins = fromJS([
      {
        title: "Bitcoin",
        code: "BTC",
      }
    ]);

    let currentCoin = supportedCoins.first();

    let addresses = this.state.addresses.map(current => {
      return <tr key={current.get("name")}>
        <td>{current.get("name")}</td>
        <td>{current.get("isDev") && <span className="label label-default">dev</span>}</td>
        <td>{current.get("currentVersion")}</td>
        <td className="infoCell">
          {current.get("projectHome") && <a href={current.get("projectHome")} target="_blank"><i className="fa fa-home fa-lg" aria-hidden="true"></i></a>}
          {current.get("bugUrl") && <a href={current.get("bugUrl")} target="_blank"><i className="fa fa-bug fa-lg" aria-hidden="true"></i></a>}
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
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={() => this.addAddress()}>Check</button>
              </span>
            </div>
            <br />
            {!addresses.isEmpty() && (
              <table className="table packagesTable">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>&nbsp;</th>
                    <th>Current</th>
                    <th>Latest</th>
                    <th>&nbsp;</th>
                    <th>Infos</th>
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

export default withRouter(Main);