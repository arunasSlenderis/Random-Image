import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./title.scss");

export default class Status extends Component {
  render() {
    return (
      <span className="title">{ this.props.title }</span>
    );
  }
}
