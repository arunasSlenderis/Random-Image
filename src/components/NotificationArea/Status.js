import React, { Component } from "react"; // eslint-disable-line no-unused-vars

require("./status.scss");

export default class Status extends Component {
  render() {
    return (
      <div className="status-container">
        <ul>
          <li>
            <i className="fa fa-thumbs-up icon"></i>
            <span className="like">
              { this.props.likes }
            </span>
          </li>
          <li>
            <i className="fa fa-thumbs-down icon"></i>
            <span className="dislike">
              { this.props.dislikes }
            </span>
          </li>
          <li>
            <i className="fa fa-eye icon"></i>
            <span className="views">
              { this.props.views }
            </span>
          </li>
        </ul>
      </div>
    );
  }
}
