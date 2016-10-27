var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./database/db");

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.post("/likeCount", (req, res) => {
  let imageId = req.body.imageId;

  db.like.findOne({
    where: { imageId }
  })
  .then(image => {
    image ? res.send(String(image.dataValues.likes)) : res.send("0");
  })
  .catch(error => {
    console.log("Error", error);
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
