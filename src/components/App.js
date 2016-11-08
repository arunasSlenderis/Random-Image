import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import $ from "jquery";

import Image from "./Image";  // eslint-disable-line no-unused-vars
import NotificationArea from "./NotificationArea/NotificationArea"; // eslint-disable-line no-unused-vars
import Controls from "./Controls"; // eslint-disable-line no-unused-vars

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      loading: {
        hidden: "fa fa-spinner fa-spin hidden",
        transparent: "nextImage",
        disabled: ""
      },
      imageId: "",
      imageWidth: "",
      ip: "",
      likeCount: 0,
      dislikeCount: 0,
      viewCount : 1,
      title: "",
      liked: false,
      disliked: false,
      disableButton: {
        disable: "",
        likeColor: "btn btn-like-dislike btn-like",
        dislikeColor: "btn btn-like-dislike btn-dislike"
      }
    };

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.getImage = this.getImage.bind(this);
    this.getinfoFromDb = this.getinfoFromDb.bind(this);
    this.increaseLikes = this.increaseLikes.bind(this);
    this.increaseDislikes = this.increaseDislikes.bind(this);
    this.getIP = this.getIP.bind(this);
  }

  componentWillMount() {
    this.getImage();
    this.getIP();
  }

  getImage() {
    let index = Math.floor(Math.random() * 100 / 2);
    let page = Math.floor(Math.random() * 100 / 1.69);
    this.setState({
      loading: {
        hidden: "fa fa-spinner fa-spin",
        transparent: "nextImage transparent",
        disabled: "disabled"
      },
      disableButton: {
        disable: "disabled",
        dislikeColor: "btn btn-like-dislike btn-dislike transparent",
        likeColor: "btn btn-like-dislike btn-like transparent"
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
          disableButton:
            (this.state.liked && this.state.disliked !== true)
              ||
            (this.state.disliked && this.state.liked !== true)
              ?
              {
                disable: "disabled",
                likeColor: "btn btn-like-dislike btn-like transparent",
                dislikeColor: "btn btn-like-dislike btn-dislike transparent"
              }
              :
              {
                disable: "",
                dislikeColor: "btn btn-like-dislike btn-dislike",
                likeColor: "btn btn-like-dislike btn-like"
              },
          imageId: data.data[index].id,
          title: data.data[index].title,
          imageWidth: data.data[index].width
        });
        $.when(this.getinfoFromDb(false, false)).done(data => {
          const { likes, dislikes, views, liked, disliked } = data;
          this.getIP();
          this.setState({
            likeCount: likes,
            dislikeCount: dislikes,
            viewCount: views,
            liked,
            disliked
          });
          if((liked && liked !== null) || (disliked && disliked !== null)) {
            this.setState({
              disableButton: {
                disable: "disabled",
                likeColor: "btn btn-like-dislike btn-like transparent",
                dislikeColor: "btn btn-like-dislike btn-dislike transparent"
              }
            });
          } else {
            this.setState({
              disableButton: {
                disable: "",
                likeColor: "btn btn-like-dislike btn-like",
                dislikeColor: "btn btn-like-dislike btn-dislike"
              }
            });
          }
        });
      } else {
        this.setState({
          loading: {
            hidden: "fa fa-spinner fa-spin",
            transparent: "nextImage transparent",
            disabled: "disabled"
          },
          disableButton: {
            disable: "disabled",
            dislikeColor: "btn btn-like-dislike btn-dislike transparent",
            likeColor: "btn btn-like-dislike btn-like transparent"
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
    this.setState({
      disableButton: {
        disable: "disabled",
        likeColor: "btn btn-like-dislike btn-like transparent",
        dislikeColor: "btn btn-like-dislike btn-dislike transparent"
      }
    });
    this.getIP();
    $.when(this.getinfoFromDb(true, false)).done(data => {
      this.setState({ likeCount: data.likes, liked: data.liked });
    });
  }

  increaseDislikes() {
    this.setState({
      disableButton: {
        disable: "disabled",
        dislikeColor: "btn btn-like-dislike btn-dislike transparent",
        likeColor: "btn btn-like-dislike btn-like transparent",
      }
    });
    this.getIP();
    $.when(this.getinfoFromDb(false, true)).done(data => {
      this.setState({ dislikeCount: data.dislikes, disliked: data.disliked });
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
      title,
      disableButton,
      imageWidth
    } = this.state;
    return (
      <div className="app-container">
        <Image
          image={ image }
        />
        <NotificationArea
          title={ title }
          width={ imageWidth }
          views={ viewCount }
          likes={ likeCount }
          dislikes={ dislikeCount }
        />
        <Controls
          like={ this.increaseLikes }
          dislike={ this.increaseDislikes }
          getImage={ this.getImage }
          loading={ loading }
          disableButton={ disableButton }
        />
      </div>
    );
  }
}
