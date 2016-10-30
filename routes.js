import path from "path";
import chalk from "chalk";

import db from "./database/db";

export const home = (req, res) => {
  res.sendFile(path.resolve("src/index.html"));
};

export const info = (req, res) => {
  let imageId = req.body.imageId;
  let ip = req.body.ip;
  let likePressed = req.body.likePressed;

  db.like.findOne({
    where: { imageId }
  })
  .then(image => {
    const data = {
      likes: image ? image.dataValues.likes : "0"
    };

    if(likePressed) {
      if(!image) {
        db.like.create({
          imageId,
          likes: 1
        });
        db.usersIP.create({
          imageId,
          ip
        });
        data.likes = 1;
        res.send(data);
      } else {
        db.usersIP.findAll({
          where: { imageId }
        })
        .then(imagesWithIP => {
          const imageWithIP = imagesWithIP.find(imageIP => {
            return ip === imageIP.dataValues.ip;
          });
          if(!imageWithIP) {
            db.usersIP.create({
              imageId,
              ip
            });
            image.update({
              likes: image.dataValues.likes + 1
            })
            .then(updatedField => {
              data.likes = updatedField.dataValues.likes;
              res.send(data);
            });
          }
        });
      }
    } else {
      res.send(data);
    }
  })
  .catch(error => {
    console.log(chalk.red("Error finding image: ", error));
  });
};
