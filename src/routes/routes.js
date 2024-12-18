const express = require("express");
const route = express.Router();

const radusuariosController = require("../controllers/radusuariosController");
const clientecontratoController = require("../controllers/clientecontratoController");
const opaController = require("../controllers/opaController")
const atendimentoController = require("../controllers/atendimentoController")


route.get('/cliente/radius', radusuariosController);
route.get('/cliente/plano', clientecontratoController);
route.get('/opa', opaController);
route.get('/opa/atendimento', atendimentoController);

module.exports = route;