import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./overlay.scss");

export default class Overlay extends Component {
  render() {
    return (
      <div className={ this.props.overlay }>
        <div className="overlay-text-container">
          <p>
            This application shows random images from imgur.com. It can contain
            bad language and other offensive content referring race, sex, sexual
            orientation and other disturbing content. If You agree with this,
            press <strong>AGREE</strong> button otherwise, leave this page.
            Thank You for understanding. <em>You can also find lots of funny pictures
            here. ENJOY</em>
            <button
              className="btn-overlay"
              onClick={ this.props.removeOverlay }
            >
              AGREE
            </button>
          </p>
        </div>
      </div>
    );
  }
}
