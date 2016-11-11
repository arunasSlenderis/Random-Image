import path from "path";
import chalk from "chalk";

import db from "./database/db";

export const corsFix = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
};

export const home = (req, res) => {
  res.sendFile(path.resolve("./src/index.html"));
};

export const info = (req, res) => {
  let imageId = req.body.imageId;
  let ip = req.body.ip;
  let likePressed = req.body.likePressed;
  let dislikePressed = req.body.dislikePressed;
  let unlikePressed = req.body.unlikePressed;
  let undislikePressed = req.body.undislikePressed;

  db.like.findOne({
    where: { imageId }
  })
  .then(image => {
    const data = {
      likes: image ? image.dataValues.likes : "0",
      dislikes: image ? image.dataValues.dislikes : "0",
      views : image ? image.dataValues.views : 1,
      liked: null,
      disliked: null
    };

    if(!image) {
      db.like.create({
        imageId,
        likes: 0,
        dislikes: 0,
        views: 1
      });
      db.usersIP.create({
        imageId,
        ip,
        liked: false,
        disliked: false
      });
      res.send(data);
    } else {
      db.usersIP.findAll({
        where: { imageId }
      })
      .then(imagesWithIP => {
        let imageWithIP = imagesWithIP.find(imageIP => {
          return ip === imageIP.dataValues.ip;
        });
        if(!imageWithIP) {
          db.usersIP.create({
            imageId,
            ip,
            liked: data.liked ? data.liked : false,
            disliked: data.disliked ? data.disliked : false
          })
          .then(newImage => {
            image.update({
              views: image.dataValues.views + 1
            })
            .then(updatedField => {
              data.views = updatedField.dataValues.views;
              res.send(data);
            });
            imageWithIP = newImage;
          });
        }
        let dislikeEvent = imageWithIP || imageWithIP === false
          ?
          imageWithIP.dataValues.disliked
          :
          null;
        let likeEvent = imageWithIP || imageWithIP === false
          ?
          imageWithIP.dataValues.liked
          :
          null;

        if(unlikePressed && imageWithIP && imageWithIP.dataValues.liked) {
          imageWithIP.update({
            liked: false
          })
          .then(updatedField => {
            data.liked = updatedField.dataValues.liked;
          });
          image.update({
            likes: image.dataValues.likes - 1
          })
          .then(updatedField => {
            data.likes = updatedField.dataValues.likes;
            // res.send(data);
          });
        }

        if(undislikePressed && imageWithIP && imageWithIP.dataValues.disliked) {
          imageWithIP.update({
            disliked: false
          })
          .then(updatedField => {
            data.disliked = updatedField.dataValues.disliked;
          });
          image.update({
            dislikes: image.dataValues.dislikes - 1
          })
          .then(updatedField => {
            data.dislikes = updatedField.dataValues.dislikes;
            // res.send(data);
          });
        }

        if(likeEvent === false || dislikeEvent === false) {
          if(likePressed && !dislikeEvent) {
            imageWithIP.update({
              liked: true
            })
            .then(updatedField => {
              data.liked = updatedField.dataValues.liked;
            });
            if(likeEvent === false) {
              image.update({
                likes:
                  likePressed
                    ?
                    image.dataValues.likes + 1
                    :
                    image.dataValues.likes
              })
              .then(updatedField => {
                data.likes = updatedField.dataValues.likes;
                res.send(data);
              });
            }
          }
          if(dislikePressed && !likeEvent) {
            imageWithIP.update({
              disliked: true
            })
            .then(updatedField => {
              data.disliked = updatedField.dataValues.disliked;
            });
            if(dislikeEvent === false) {
              image.update({
                dislikes:
                  dislikePressed
                    ?
                    image.dataValues.dislikes + 1
                    :
                    image.dataValues.dislikes,
              })
              .then(updatedField => {
                data.dislikes = updatedField.dataValues.dislikes;
                res.send(data);
              });
            }
          }
          if(!likePressed && !dislikePressed) {
            data.liked = imageWithIP.dataValues.liked;
            data.disliked = imageWithIP.dataValues.disliked;
            res.send(data);
          }
        }
      });
    }
  })
  .catch(error => {
    console.error(chalk.red("Error finding image: ", error));
  });
};
