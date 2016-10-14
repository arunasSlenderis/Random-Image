const express = require("express");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const bodyParser = require("body-parser");

const config = require("./webpack.config");
const db = require("./database/db");

const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/index.html"));
});

app.post("/", (req) => {
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
            db.usersIP.create({
              imageId: req.body.imageId,
              liked: true,
              ip: req.body.ip
            });
            likeInstance.update({
              likes: likeInstance.get("likes") + 1
            });
          }
        } else {
          db.usersIP.create({
            imageId: req.body.imageId,
            liked: true,
            ip: req.body.ip
          });
        }
      });
    } else {
      db.like.create({
        imageId: req.body.imageId,
        likes: req.body.likes
      });
      db.usersIP.create({
        imageId: req.body.imageId,
        liked: true,
        ip: req.body.ip
      });
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
