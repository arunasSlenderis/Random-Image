import React, { Component } from "react"; // eslint-disable-line no-unused-vars

import Status from "./Status";  // eslint-disable-line no-unused-vars

export default class NotificationArea extends Component {
  render() {
    return (
      <Status
        views={ this.props.views }
        likes={ this.props.likes }
        dislikes={ this.props.dislikes }
      />
    );
  }
}
