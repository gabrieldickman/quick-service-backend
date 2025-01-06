const express = require("express");
const route = express.Router();

const radusuariosController = require("../controllers/ixcControllers/radusuariosController");
const clientecontratoController = require("../controllers/ixcControllers/clientecontratoController");

const opaController = require("../controllers/opaControllers/opaController");
const atendimentoController = require("../controllers/opaControllers/atendimentoController");

route.get("/cliente/radius", radusuariosController);
route.get("/cliente/plano", clientecontratoController);
route.get("/opa", opaController);
route.get("/opa/atendimento", atendimentoController);

module.exports = route;
