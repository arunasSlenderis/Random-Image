import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import $ from "jquery";

import Image from "./Image";  // eslint-disable-line no-unused-vars
import NotificationArea from "./NotificationArea/NotificationArea"; // eslint-disable-line no-unused-vars
import Controls from "./Controls"; // eslint-disable-line no-unused-vars

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "http://i.imgur.com/RRUe0Mo.png",
      loading: "",
      imageId: "",
      ip: "no ip",
      likeCount: 0,
      likeButtonPressed: false
    };

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.getImage = this.getImage.bind(this);
    this.getinfoFromDb = this.getinfoFromDb.bind(this);
    this.increaseLikes = this.increaseLikes.bind(this);
    this.getIP = this.getIP.bind(this);
  }

  getImage() {
    let index = Math.floor(Math.random() * 100 / 2);
    let page = Math.floor(Math.random() * 100 / 1.69);

    this.setState({ loading: "Loading...", likeButtonPressed: false });

    $.ajax({
      url: this.url + page, //page
      dataType: "json",
      beforeSend(xhr) {
        xhr.setRequestHeader("Authorization", "Client-ID ecac85d04d4ce16");
      }
    }).done(data => {
      const ext = data.data[index].link.slice(-3);  //getting extension

      if( ext === "png" || ext === "gif" || ext === "jpg") {
        this.setState({
          image: data.data[index].link, //index
          loading: "",
          imageId: data.data[index].id
        });
        $.when(this.getinfoFromDb(false)).done(data => {
          this.setState({ likeCount: data.likes });
        });
      } else {
        this.setState({ loading: "Loading..." });
        this.getImage();
      }
    });
  }

  getinfoFromDb(liked) {
    return $.ajax({
      url: "/info",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        imageId: this.state.imageId,
        ip: this.state.ip,
        liked
      })
    });
  }

  increaseLikes() {
    this.setState({ likeButtonPressed: true });
    this.getIP();
    $.when(this.getinfoFromDb(true)).done(data => {
      this.setState({ likeCount: data.likes });
    });
  }

  getIP() {
    $.getJSON("//api.ipify.org?format=jsonp&callback=?", ip => {
      this.setState({ ip: ip.ip });
    });
  }

  render() {
    const { loading, image, imageId, likeCount } = this.state;
    return (
      <div>
        <Image
          loading={ loading }
          image={ image }
          imageId={ imageId }
          getImage={ this.getImage }
        />
      <NotificationArea likes={ likeCount }/>
        <Controls like={ this.increaseLikes }/>
      </div>
    );
  }
}
