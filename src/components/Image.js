import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import $ from "jquery";
require("./image.scss");

export default class Image extends Component {
  constructor(props) {
    super(props);

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.state = { image: "http://i.imgur.com/RRUe0Mo.png", loading: ""};
    this.getImage = this.getImage.bind(this);
  }

  getImage() {
    let index = Math.floor(Math.random() * 100 / 2);
    let page = Math.floor(Math.random() * 100 / 1.69);

    this.setState({loading: "Loading"});

    $.ajax({
      url: this.url + page,
      dataType: "json",
      beforeSend(xhr) {
        xhr.setRequestHeader("Authorization", "Client-ID ecac85d04d4ce16");
      },
      success() {

      }
    }).done(data => {
      const ext = data.data[index].link.slice(-3);  //getting extension

      if( ext === "png" || ext === "gif" || ext === "jpg") {
        this.setState({image: data.data[index].link, loading: ""});
      } else {
        this.setState({loading: "Loading"});
        this.getImage();
      }
    });
  }

  render() {
    return (
      <div className="image-container">
        <img src={this.state.image} />
        <button onClick={this.getImage}>NEXT</button>
        <span>{this.state.loading}</span>
      </div>
    );
  }
}
