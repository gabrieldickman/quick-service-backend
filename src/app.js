const express = require("express");
const app = express();
const routes = require('./routes/routes');

app.get("/", (req, res) => {
  res.send("<h1> Home page </h1>");
})
app.use(routes);

module.exports = app;