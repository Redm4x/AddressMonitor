import * as React from "react";
import { render } from "react-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import { Provider } from "react-redux";
import store from "./reducers/rootReducer";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import "./sass/main.scss";

import Main from "./containers/main";

var fr = require('react-intl/locale-data/fr');
addLocaleData(fr);

render(
  <IntlProvider locale="en-CA">
    <Provider store={store}>
      <Main />
    </Provider>
  </IntlProvider>,
  document.getElementById("root")
)