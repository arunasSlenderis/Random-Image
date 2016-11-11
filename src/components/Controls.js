import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./controls.scss");

export default class Controls extends Component {
  render() {
    // let buttonClass = "btn btn-views" + {this.props.loading.transparent};
    // let loadingIconClass = "fa fa-spinner fa-spin" + {this.props.loading.hidden};
    return (
      <div className="controls-container">
        <button
          className={ this.props.disableButton.likeColor }
          onClick={ this.props.like }
          disabled={ this.props.disableButton.disable }
        >
        </button>
        <button
          onClick={ this.props.unlike }
          className={ this.props.disableButton.unlike }
        >
        </button>
        <button
          className={ this.props.disableButton.dislikeColor }
          onClick={ this.props.dislike }
          disabled={ this.props.disableButton.disable }
        >
        </button>
        <button
          onClick={ this.props.undislike }
          className={ this.props.disableButton.undislike }
        >
        </button>
        <button
          className="btn btn-views"
          onClick={ this.props.getImage }
          disabled={ this.props.loading.disabled }
        >
          <i className={ this.props.loading.hidden } aria-hidden="true"></i>
          NEXT
        </button>
      </div>
    );
  }
}
