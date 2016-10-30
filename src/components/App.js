import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import $ from "jquery";

import Image from "./Image";  // eslint-disable-line no-unused-vars
import NotificationArea from "./NotificationArea/NotificationArea"; // eslint-disable-line no-unused-vars
import Controls from "./Controls"; // eslint-disable-line no-unused-vars

export default class App extends Component {
  constructor(props) {
    super(props);

    this.getIP();

    this.state = {
      image: "http://i.imgur.com/RRUe0Mo.png",
      loading: "",
      imageId: "",
      ip: "",
      likeCount: 0,
      dislikeCount: 0,
      viewCount : 1
    };

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.getImage = this.getImage.bind(this);
    this.getinfoFromDb = this.getinfoFromDb.bind(this);
    this.increaseLikes = this.increaseLikes.bind(this);
    this.increaseDislikes = this.increaseDislikes.bind(this);
    this.displayViews = this.displayViews.bind(this);
    this.getIP = this.getIP.bind(this);
  }

  getImage() {
    let index = Math.floor(Math.random() * 100 / 2);
    let page = Math.floor(Math.random() * 100 / 1.69);

    this.setState({ loading: "Loading..." });

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
        $.when(this.getinfoFromDb(false, false)).done(data => {
          this.getIP();
          this.setState({
            likeCount: data.likes,
            dislikeCount: data.dislikes,
            viewCount: data.views
          });
        });
      } else {
        this.setState({ loading: "Loading..." });
        this.getImage();
      }
    });
  }

  getinfoFromDb(likePressed, dislikePressed) {
    return $.ajax({
      url: "/info",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        imageId: this.state.imageId,
        ip: this.state.ip,
        likePressed,
        dislikePressed,
        views: this.state.viewCount
      })
    });
  }

  increaseLikes() {
    this.getIP();
    $.when(this.getinfoFromDb(true, false)).done(data => {
      this.setState({ likeCount: data.likes });
    });
  }

  increaseDislikes() {
    this.getIP();
    $.when(this.getinfoFromDb(false, true)).done(data => {
      this.setState({ dislikeCount: data.dislikes });
    });
  }

  displayViews() {

  }

  getIP() {
    $.getJSON("//api.ipify.org?format=jsonp&callback=?", ip => {
      this.setState({ ip: ip.ip });
    });
  }

  render() {
    const {
      loading,
      image,
      imageId,
      likeCount,
      dislikeCount,
      viewCount
    } = this.state;
    return (
      <div>
        <Image
          loading={ loading }
          image={ image }
          imageId={ imageId }
          getImage={ this.getImage }
        />
        <NotificationArea
          views={ viewCount }
          likes={ likeCount }
          dislikes={ dislikeCount }
        />
        <Controls
          like={ this.increaseLikes }
          dislike={ this.increaseDislikes }
        />
      </div>
    );
  }
}
