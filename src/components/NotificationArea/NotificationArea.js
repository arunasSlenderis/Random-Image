import React, { Component } from "react"; // eslint-disable-line no-unused-vars

import Status from "./Status";  // eslint-disable-line no-unused-vars
import Title from "./Title";  // eslint-disable-line no-unused-vars

export default class NotificationArea extends Component {
  render() {
    return (
      <div>
        <Title title={ this.props.title } width={ this.props.width } />
        <Status
          views={ this.props.views }
          likes={ this.props.likes }
          dislikes={ this.props.dislikes }
        />
      </div>
    );
  }
}
