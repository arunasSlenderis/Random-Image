import React from "react";  // eslint-disable-line no-unused-vars
import { render } from "react-dom";

import App from "./components/App"; // eslint-disable-line no-unused-vars

require("./styles.scss");

render(
  <App />,
  document.getElementById("app")
);
