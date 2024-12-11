const express = require("express");
const route = express.Router();

const radusuariosController = require("../controllers/radusuariosController");
const clientecontratoController = require("../controllers/clientecontratoController");


route.get('/cliente/radius', radusuariosController);
route.get('/cliente/contrato', clientecontratoController);

module.exports = route;