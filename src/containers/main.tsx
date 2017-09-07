import * as React from "react";
import { connect } from "react-redux";

import { Map, List, fromJS } from "immutable";
import { loadAddresses, loadPrices, computePrices, updateCurrentAddress, addAddress } from "../actions/actions";
import { TrackedAddressRow } from "../components/trackedAddressRow";
import { AddAddressForm } from "../components/addAddressForm";

interface IAppProps {
  addresses: List<Map<string, any>>;
  currentAddress: string;
  isCurrentAddressInvalid: boolean;

  loadAddresses: () => Promise<void>;
  loadPrices: () => Promise<void>;
  computePrices: () => void;
  updateCurrentAddress: (newAddress: string) => void;
  addAddress: () => void;
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

  render() {
    const { addresses, currentAddress, addAddress, isCurrentAddressInvalid, updateCurrentAddress } = this.props;
    
    let addressList = addresses.map(current => {
      return <TrackedAddressRow key={current.get("address")} trackedAddress={current} />
    }).toList();

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <h1 className="pageTitle">Address Monitor</h1>
            <AddAddressForm
              addAddress={addAddress}
              currentAddress={currentAddress}
              isCurrentAddressInvalid={isCurrentAddressInvalid}
              updateCurrentAddress={updateCurrentAddress} />
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
    isCurrentAddressInvalid: state.get("isCurrentAddressInvalid"),
  }
}

export default connect(mapStateToProps, {
  loadAddresses,
  loadPrices,
  computePrices,
  updateCurrentAddress,
  addAddress,
})(Main);