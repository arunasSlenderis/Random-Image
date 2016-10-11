import React, { Component } from "react"; // eslint-disable-line no-unused-vars

import Image from "./Image";  // eslint-disable-line no-unused-vars
import NotificationArea from "./NotificationArea/NotificationArea"; // eslint-disable-line no-unused-vars
import Controls from "./Controls"; // eslint-disable-line no-unused-vars

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Image />
        <NotificationArea />
        <Controls />
      </div>
    );
  }
}
