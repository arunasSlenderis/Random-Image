import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import $ from "jquery";
import Swipe from "react-easy-swipe"; // eslint-disable-line no-unused-vars

import Image from "./Image";  // eslint-disable-line no-unused-vars
import NotificationArea from "./NotificationArea/NotificationArea"; // eslint-disable-line no-unused-vars
import Controls from "./Controls"; // eslint-disable-line no-unused-vars
import Overlay from "./Overlay"; // eslint-disable-line no-unused-vars

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
        dislikeColor: "btn btn-like-dislike btn-dislike",
        unlike: "btn btn-like-dislike unlike hidden",
        undislike: "btn btn-like-dislike undislike hidden"
      },
      tranparent: "",
      overlay: "overlay"
    };

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.getImage = this.getImage.bind(this);
    this.getinfoFromDb = this.getinfoFromDb.bind(this);
    this.increaseLikes = this.increaseLikes.bind(this);
    this.decreaseLikes = this.decreaseLikes.bind(this);
    this.increaseDislikes = this.increaseDislikes.bind(this);
    this.decreaseDislikes = this.decreaseDislikes.bind(this);
    this.getIP = this.getIP.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.update = this.update.bind(this);
    this.onSwipeMove = this.onSwipeMove.bind(this);
    this.removeOverlay = this.removeOverlay.bind(this);

    this.update();
  }

  onSwipeMove() {
    this.setState({ transparent: "transparent" });
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
        likeColor: "btn btn-like-dislike btn-like transparent",
        unlike: "btn btn-like-dislike unlike hidden",
        undislike: "btn btn-like-dislike undislike hidden"
      },
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
                likeColor: "btn btn-like-dislike btn-like hidden",
                dislikeColor: "btn btn-like-dislike btn-dislike hidden",
                unlike: "btn btn-like-dislike unlike",
                undislike: "btn btn-like-dislike undislike"
              }
              :
              {
                disable: "",
                dislikeColor: "btn btn-like-dislike btn-dislike",
                likeColor: "btn btn-like-dislike btn-like",
                unlike: "btn btn-like-dislike unlike hidden",
                undislike: "btn btn-like-dislike undislike hidden"
              },
          imageId: data.data[index].id,
          title: data.data[index].title,
          imageWidth: data.data[index].width
        });
        this.updateStatus();
      } else {
        this.setState({
          loading: {
            hidden: "fa fa-spinner fa-spin",
            transparent: "nextImage transparent",
            disabled: "disabled"
          },
          disableButton: {
            disable: "disabled",
            dislikeColor: "btn btn-like-dislike btn-dislike hidden",
            likeColor: "btn btn-like-dislike btn-like hidden",
            unlike: "btn btn-like-dislike unlike",
            undislike: "btn btn-like-dislike undislike"
          }
        });
        this.getImage();
      }
    });
  }

  getinfoFromDb(likePressed, dislikePressed, unlikePressed, undislikePressed) {
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
        unlikePressed,
        undislikePressed,
        views: viewCount
      })
    });
  }

  increaseLikes() {
    this.setState({
      disableButton: {
        disable: "disabled",
        likeColor: "btn btn-like-dislike btn-like hidden",
        dislikeColor: "btn btn-like-dislike btn-dislike transparent",
        unlike: "btn btn-like-dislike unlike",
        undislike: "btn btn-like-dislike undislike hidden"
      }
    });
    this.getIP();
    $.when(this.getinfoFromDb(true, false, false, false)).done(data => {
      this.setState({ likeCount: data.likes, liked: data.liked });
    });
  }

  decreaseLikes() {
    this.setState({
      disableButton: {
        disable: "",
        likeColor: "btn btn-like-dislike btn-like",
        dislikeColor: "btn btn-like-dislike btn-dislike",
        unlike: "btn btn-like-dislike unlike hidden",
        undislike: "btn btn-like-dislike undislike hidden"
      }
    });
    this.getIP();
    $.when(this.getinfoFromDb(false, false, true, false)).done(data => {
      this.setState({ likeCount: data.likes, liked: data.liked });
    });
  }

  increaseDislikes() {
    this.setState({
      disableButton: {
        disable: "disabled",
        dislikeColor: "btn btn-like-dislike btn-dislike hidden",
        likeColor: "btn btn-like-dislike btn-like transparent",
        unlike: "btn btn-like-dislike unlike hidden",
        undislike: "btn btn-like-dislike undislike"
      }
    });
    this.getIP();
    $.when(this.getinfoFromDb(false, true, false, false)).done(data => {
      this.setState({ dislikeCount: data.dislikes, disliked: data.disliked });
    });
  }

  decreaseDislikes() {
    this.setState({
      disableButton: {
        disable: "",
        dislikeColor: "btn btn-like-dislike btn-dislike",
        likeColor: "btn btn-like-dislike btn-like",
        unlike: "btn btn-like-dislike unlike hidden",
        undislike: "btn btn-like-dislike undislike hidden"
      }
    });
    this.getIP();
    $.when(this.getinfoFromDb(false, false, false, true)).done(data => {
      this.setState({ dislikeCount: data.dislikes, disliked: data.disliked });
    });
  }

  getIP() {
    $.getJSON("//api.ipify.org?format=jsonp&callback=?", ip => {
      this.setState({ ip: ip.ip });
      // console.log(ip);
    });
  }

  updateStatus() {
    $.when(this.getinfoFromDb(false, false, false, false)).done(data => {
      const { likes, dislikes, views, liked, disliked } = data;
      this.getIP();
      this.setState({
        likeCount: likes,
        dislikeCount: dislikes,
        viewCount: views,
        liked,
        disliked,
        transparent: ""
      });
      if((liked && liked !== null) || (disliked && disliked !== null)) {
        this.setState({
          disableButton: {
            disable: "disabled",
            likeColor: "btn btn-like-dislike btn-like hidden",
            dislikeColor: "btn btn-like-dislike btn-dislike hidden",
            unlike: "btn btn-like-dislike unlike",
            undislike: "btn btn-like-dislike undislike"
          }
        });
      } else {
        this.setState({
          disableButton: {
            disable: "",
            likeColor: "btn btn-like-dislike btn-like",
            dislikeColor: "btn btn-like-dislike btn-dislike",
            unlike: "btn btn-like-dislike unlike hidden",
            undislike: "btn btn-like-dislike undislike hidden"
          }
        });
      }
    });
  }

  update() {
    setInterval(() => {
      this.updateStatus();
    }, 4000);
  }

  removeOverlay() {
    this.setState({ overlay: "hidden"});
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
      imageWidth,
      transparent
    } = this.state;
    return (
      <div className="app-container">
        <Overlay
          removeOverlay={ this.removeOverlay }
          overlay={ this.state.overlay }
        />
        <Swipe
          onSwipeMove={ this.onSwipeMove }
          onSwipeEnd={ this.getImage }
        >
          <Image
            image={ image }
            loading={ loading }
            transparent={ transparent }
          />
        </Swipe>
        <NotificationArea
          title={ title }
          width={ imageWidth }
          views={ viewCount }
          likes={ likeCount }
          dislikes={ dislikeCount }
        />
        <Controls
          like={ this.increaseLikes }
          unlike={ this.decreaseLikes }
          dislike={ this.increaseDislikes }
          undislike={ this.decreaseDislikes }
          getImage={ this.getImage }
          loading={ loading }
          disableButton={ disableButton }
        />
      </div>
    );
  }
}
