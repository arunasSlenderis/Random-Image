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
      likeCount: 0
    };

    // this.likeData = {
    //   imageId: this.state.imageId,
    //   likes: 0
    // };

    this.url = "https://api.imgur.com/3/gallery/random/random/";

    this.getImage = this.getImage.bind(this);
    this.like = this.like.bind(this);
    this.getIP = this.getIP.bind(this);
    this.getLikeCount = this.getLikeCount.bind(this);
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
        this.setState({
          image: data.data[index].link,
          loading: "",
          imageId: data.data[index].id
        });
      } else {
        this.setState({ loading: "Loading" });
        this.getImage();
      }
    });
  }

  like() {
    this.getIP();
    this.getLikeCount();
    $.ajax({
      url: "/",
      type: "POST",
      data: { imageId: this.state.imageId, likes: 1, ip: "85527799"/*this.state.ip*/ },
      success(data) {
        console.log(`Success ${data}`);
      },
      error() {
        console.log("error");
      }
    });
  }

  getIP() {
    // $.getJSON("//api.ipify.org?format=jsonp&callback=?", ip => {
      // let userIP = ip.ip;
      // this.setState({ ip: userIP });
    // });
  }

  getLikeCount() {
    //get data from database
    $.ajax({
      url: "/data"
    })
    .done(data => this.setState({ likeCount: data }));
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
        <Controls like={ this.like } />
      </div>
    );
  }
}
