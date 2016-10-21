var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./database/db");

var imageIdFromDb = "";

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.get("/data", (req, res) => {
  db.like.findOne({
    where: {
      imageId: imageIdFromDb
    }
  })
  .then(likeInstance => {
    res.json(likeInstance.get("likes"));
  });
});


app.post("/", req => {
  imageIdFromDb = req.body.imageId;
  const addDataToUsersIP = () => {
    db.usersIP.create({
      imageId: req.body.imageId,
      liked: true,
      ip: req.body.ip
    });
  };

  db.like.findOne({   //finds match with liked image
    where: {
      imageId: req.body.imageId
    }
  })
  .then(likeInstance => {
    if(likeInstance) {
      db.usersIP.findAll({
        where: {
          imageId: req.body.imageId
        }
      })
      .then(usersIpInstance => {
        if(usersIpInstance) {
          const user = usersIpInstance.find(user => {
            return user.ip === req.body.ip;
          });
          if(!user) {
            addDataToUsersIP();
            likeInstance.update({
              likes: likeInstance.get("likes") + 1
            });
          }
        } else {
          addDataToUsersIP();
        }
      });
    } else {
      db.like.create({
        imageId: req.body.imageId,
        likes: req.body.likes
      });
      addDataToUsersIP();
    }
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
