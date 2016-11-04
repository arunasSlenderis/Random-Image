import "source-map-support/register";
import express from "express";
import bodyParser from "body-parser";

import db from "./database/db";
import * as routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("/*", routes.corsFix);

app.get("/", routes.home);

app.post("/info", routes.info);

db.connection.sync({
  force: true
})
.then(() => {
  app.listen(PORT, error => {
    if(error) throw new Error("Server fault: ", error);
    console.log("Server is listening on port:", PORT);
  });
});
