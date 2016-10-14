import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./image.scss");

export default class Image extends Component {
  render() {
    const { image, getImage, loading } = this.props;
    return (
      <div className="image-container">
        <img src={ image } />
        <button onClick={ getImage }>NEXT</button>
        <span>{ loading }</span>
      </div>
    );
  }
}
