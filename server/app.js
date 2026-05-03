const express = require("express");
const cors = require("cors");
const app = express();
const port = 8888;

const articleController = require("./controller/article");
const topicController = require("./controller/topic");

app.use(cors());
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("ShareMind API is running.");
});

app.use("/article", articleController);
app.use("/topic", topicController);

app.listen(port, () => {
  console.log(`ShareMind app listening on port ${port}`);
});
