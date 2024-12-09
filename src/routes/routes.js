const express = require("express");
const route = express.Router();

const ixcController = require("../controllers/ixcController");

route.get('/cliente', ixcController);

module.exports = route;