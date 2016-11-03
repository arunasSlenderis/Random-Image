import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./controls.scss");

export default class Controls extends Component {
  render() {
    // let buttonClass = "btn btn-views" + {this.props.loading.transparent};
    // let loadingIconClass = "fa fa-spinner fa-spin" + {this.props.loading.hidden};
    return (
      <div className="controls-container">
        <button
          className="btn btn-like-dislike btn-like"
           onClick={ this.props.like }
        >
        </button>
        <button
          className="btn btn-like-dislike btn-dislike"
          onClick={ this.props.dislike }
        >
        </button>
        <button
          className="btn btn-views"
          onClick={ this.props.getImage }
          disabled={ this.props.loading.disabled }
        >
          <i className={ this.props.loading.hidden } aria-hidden="true"></i>
          <img
            src={ require("../images/next-new-resized-min.jpg") }
            alt="NEXT"
            className={ this.props.loading.transparent }
          />
        </button>
      </div>
    );
  }
}
