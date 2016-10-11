const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("./dist"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

app.listen(PORT, error => {
  if(error) throw new Error("Server fault: ", error);
  console.log(`Server is listening on port: ${PORT}`);
});
