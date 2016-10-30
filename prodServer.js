var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./database/db");

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/index.html"));
});

app.post("/info", (req, res) => {
  let imageId = req.body.imageId;
  let ip = req.body.ip;
  let likePressed = req.body.likePressed;
  let dislikePressed = req.body.dislikePressed;

  db.like.findOne({
    where: { imageId }
  })
  .then(image => {
    const data = {
      likes: image ? image.dataValues.likes : "0",
      dislikes: image ? image.dataValues.dislikes : "0",
      views : image ? image.dataValues.views : "1"
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
        liked_disliked: false
      });
      res.send(data);
    } else {
      db.usersIP.findAll({
        where: { imageId }
      })
      .then(imagesWithIP => {
        const imageWithIP = imagesWithIP.find(imageIP => {
          return ip === imageIP.dataValues.ip;
        });
        if(imageWithIP.dataValues.liked_disliked === false) {
          if(likePressed || dislikePressed) {
            imageWithIP.update({
              liked_disliked: true
            });
            image.update({
              likes:
                likePressed
                  ?
                  image.dataValues.likes + 1
                  :
                  image.dataValues.likes,
              dislikes:
                dislikePressed
                  ?
                  image.dataValues.dislikes + 1
                  :
                  image.dataValues.dislikes,
            })
            .then(updatedField => {
              data.likes = updatedField.dataValues.likes;
              data.dislikes = updatedField.dataValues.dislikes;
              res.send(data);
            });
          }
        } else if(!imageWithIP) {
          image.update({
            views: image.dataValues.views + 1
          })
          .then(updatedField => {
            data.views = updatedField.dataValues.views;
            res.send(data);
          });
        }
      });
    }
  })
  .catch(error => {
    console.log("Error finding image: ", error);
  });
});

db.connection.sync({
  // force: true
})
.then(() => {
  app.listen(PORT, error => {
    if(error) throw new Error("Server fault: ", error);
    console.log(`Server is listening on port: ${PORT}`);
  });
});
