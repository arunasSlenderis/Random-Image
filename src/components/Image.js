import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./image.scss");

export default class Image extends Component {
  render() {
    return (
      <div className="image-container">
        <img src={ this.props.image } />
      </div>
    );
  }
}
