var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./database/db");
const routes = require("./routes");

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", routes.home);

app.post("/info", routes.info);

db.connection.sync({
  // force: true
})
.then(() => {
  app.listen(PORT, error => {
    if(error) throw new Error("Server fault: ", error);
    console.log(`Server is listening on port: ${PORT}`);
  });
});
