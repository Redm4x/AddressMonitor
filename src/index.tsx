import * as React from "react";
import { render } from "react-dom";
import { IntlProvider, addLocaleData } from "react-intl";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./sass/main.scss";

import Main from "./components/main";

var fr = require('react-intl/locale-data/fr');
addLocaleData(fr);

render(
    <IntlProvider locale="en-CA">
      <Main />
    </IntlProvider>,
  document.getElementById("root")
)