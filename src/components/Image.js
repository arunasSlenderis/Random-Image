import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./image.scss");

export default class Image extends Component {
  render() {
    return (
      <div className="image-container">
        <img className={ this.props.transparent } src={ this.props.image } />
        <i
          id="image-loading" 
          className={ this.props.loading.hidden }
          aria-hidden="true">
        </i>
      </div>
    );
  }
}
