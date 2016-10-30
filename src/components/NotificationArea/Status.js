import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./status.scss");

export default class Status extends Component {
  render() {
    return (
      <ul>
        <li><i className="fa fa-eye"></i>{ this.props.views }</li>
        <li><i className="fa fa-thumbs-up">{ this.props.likes }</i></li>
        <li><i className="fa fa-thumbs-down">{ this.props.dislikes }</i></li>
      </ul>
    );
  }
}
