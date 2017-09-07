import * as React from "react";

import { Map, List, fromJS } from "immutable";
import { addAddress } from "../actions/actions";
import { supportedCoins } from "../utils/contants";
import * as classNames from "classnames";

require('bootstrap/dist/js/bootstrap.min');

interface IAppProps {
  currentAddress: string;
  isCurrentAddressInvalid: boolean;

  updateCurrentAddress: (newAddress: string) => void;
  addAddress: () => void;
}

export class AddAddressForm extends React.Component<IAppProps, void> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    const { currentAddress, addAddress, isCurrentAddressInvalid, updateCurrentAddress } = this.props;

    let currentCoin = supportedCoins.first();

    let coinList = supportedCoins.map(c => {
      return <li key={c.get("code")}><a className="dropdown-item" href="#">{c.get("code")}</a></li>;
    });

    const donateAddress = "12E5AiZ2rDRRgnnLr7mqJ1eRfjhqAaHC3Z";

    return (
      <form onSubmit={(e) => { e.preventDefault(); addAddress() }}>
        <div className={classNames("form-group", { "has-error": isCurrentAddressInvalid })}>
          <div className="input-group">
            <div className="input-group-btn">
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {currentCoin.get("code")} <span className="caret"></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-left">
                {coinList}
              </ul>
            </div>
            <input type="text" value={currentAddress} className="form-control" onChange={e => updateCurrentAddress(e.target.value)} placeholder={`Enter address (ex : ${donateAddress})`} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">Check</button>
            </span>
          </div>
        </div>
      </form>
    );
  }
}