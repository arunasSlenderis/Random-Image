const express = require("express");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const bodyParser = require("body-parser");
const chalk = require("chalk");

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

app.post("/info", (req, res) => {
  let imageId = req.body.imageId;
  let ip = req.body.ip;
  let liked = req.body.liked;

  db.like.findOne({
    where: { imageId }
  })
  .then(image => {
    const data = {
      likes: image ? image.dataValues.likes : "0"
    };

    if(liked) {
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
      } else {
        db.usersIP.findAll({
          where: { imageId }
        })
        .then(imagesWithIP => {
          const imageWithIP = imagesWithIP.find(imageIP => ip === imageIP.dataValues.ip);
          if(!imageWithIP) {
            db.usersIP.create({
              imageId,
              ip
            });
            image.update({
              likes: image.dataValues.likes + 1
            })
            .then(updatedField => {
              data.likes = updatedField;
            });
          }
        });
      }
      res.send(data);
    } else {
      console.log("like not pressed");
      res.send(data);
    }

  })
  .catch(error => {
    console.log(chalk.red("Error", error));
  });
});

db.connection.sync({
  // force: true
})
.then(() => {
  app.listen(PORT, error => {
    if(error) throw new Error(chalk.red("Server fault: ", error));
    console.log(chalk.bgBlue("Server is listening on port:"), PORT);
  });
});
