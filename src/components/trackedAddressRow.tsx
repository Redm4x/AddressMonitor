import * as React from "react";

import { Map, List, fromJS } from "immutable";

interface IAppProps {
  trackedAddress: Map<string, any>;

  removeAddress: (address: Map<string, any>) => any;
}

export class TrackedAddressRow extends React.Component<IAppProps, void> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    const { trackedAddress, removeAddress } = this.props;

    return (
      <tr>
        <td>{trackedAddress.get("address")}</td>
        <td>{trackedAddress.getIn(["coin", "code"])}</td>
        <td>
          {trackedAddress.get("isLoadingBalance")
            ? <i className="fa fa-spinner fa-spin fa-fw"></i>
            : <span>{trackedAddress.get("balance")}</span>
          }
        </td>
        <td>
          {trackedAddress.get("isLoadingPrice")
            ? <i className="fa fa-spinner fa-spin fa-fw"></i>
            : <span>{Math.round(trackedAddress.get("price") * 100) / 100}$</span>
          }
        </td>
        <td><a href="javascript:;" onClick={() => removeAddress(trackedAddress)}><i className="fa fa-times"></i></a></td>
      </tr>
    );
  }
}