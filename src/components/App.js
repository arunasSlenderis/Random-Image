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
      loading: {
        hidden: "fa fa-spinner fa-spin hidden",
        transparent: "nextImage",
        disabled: ""
      },
      imageId: "",
      ip: "",
      likeCount: 0,
      dislikeCount: 0,
      viewCount : 1,
      title: "",
      liked: false,
      disliked: false
    };

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.getImage = this.getImage.bind(this);
    this.getinfoFromDb = this.getinfoFromDb.bind(this);
    this.increaseLikes = this.increaseLikes.bind(this);
    this.increaseDislikes = this.increaseDislikes.bind(this);
    this.getIP = this.getIP.bind(this);
  }

  getImage() {
    let index = Math.floor(Math.random() * 100 / 2);
    let page = Math.floor(Math.random() * 100 / 1.69);

    this.setState({
      loading: {
        hidden: "fa fa-spinner fa-spin",
        transparent: "nextImage transparent",
        disabled: "disabled"
      }
    });

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
          loading: {
            hidden: "fa fa-spinner fa-spin hidden",
            transparent: "nextImage",
            disabled: ""
          },
          imageId: data.data[index].id,
          title: data.data[index].title
        });
        $.when(this.getinfoFromDb(false, false)).done(data => {
          const { likes, dislikes, views} = data;
          this.getIP();
          this.setState({
            likeCount: likes,
            dislikeCount: dislikes,
            viewCount: views
          });
        });
      } else {
        this.setState({
          loading: {
            hidden: "fa fa-spinner fa-spin",
            transparent: "nextImage transparent",
            disabled: "disabled"
          }
        });
        this.getImage();
      }
    });
  }

  getinfoFromDb(likePressed, dislikePressed) {
    const { imageId, ip, viewCount } = this.state;
    return $.ajax({
      url: "/info",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        imageId,
        ip,
        likePressed,
        dislikePressed,
        views: viewCount
      })
    });
  }

  increaseLikes() {
    this.setState({ liked: true });
    this.getIP();
    $.when(this.getinfoFromDb(true, false)).done(data => {
      this.setState({ likeCount: data.likes });
    });
  }

  increaseDislikes() {
    this.setState({ disliked: true });
    this.getIP();
    $.when(this.getinfoFromDb(false, true)).done(data => {
      this.setState({ dislikeCount: data.dislikes });
    });
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
      likeCount,
      dislikeCount,
      viewCount,
      title
    } = this.state;
    return (
      <div>
        <Image
          image={ image }
        />
        <NotificationArea
          title={ title }
          views={ viewCount }
          likes={ likeCount }
          dislikes={ dislikeCount }
        />
        <Controls
          like={ this.increaseLikes }
          dislike={ this.increaseDislikes }
          getImage={ this.getImage }
          loading={ loading }

        />
      </div>
    );
  }
}
