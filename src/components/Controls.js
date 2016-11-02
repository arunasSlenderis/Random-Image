import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./controls.scss");

export default class Controls extends Component {
  render() {
    return (
      <div className="controls-container">
        <button className="btn" onClick={ this.props.like }>LIKE</button>
        <button className="btn" onClick={ this.props.dislike }>DISLIKE</button>
        <button className="btn" onClick={ this.props.getImage }>NEXT</button>
        <span>{ this.props.loading }</span>
      </div>
    );
  }
}
