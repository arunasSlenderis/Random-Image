import React, { Component } from "react"; // eslint-disable-line no-unused-vars

export default class Controls extends Component {
  render() {
    return (
      <div>
        <button onClick={ this.props.like }>LIKE</button>
      </div>
    );
  }
}
