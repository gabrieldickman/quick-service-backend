const express = require("express");
const route = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const authController = require("../controllers/activeDirectory/authController"); 

const radusuariosController = require("../controllers/ixcControllers/radusuariosController");
const clientecontratoController = require("../controllers/ixcControllers/clientecontratoController");
const clienteController = require("../controllers/ixcControllers/clienteController");

const opaController = require("../controllers/opaControllers/opaController");
const atendimentoController = require("../controllers/opaControllers/atendimentoController");

route.post("/login", authController.user_authenticate);

route.get("/api/v1/cliente/radius", verificarToken, radusuariosController);
route.get("/api/v1/cliente/plano", verificarToken, clientecontratoController);
route.get("/api/v1/cliente/cadastro", verificarToken, clienteController);
route.get("/api/v1/opa", verificarToken, opaController);
route.get("/api/v1/opa/atendimento", verificarToken, atendimentoController);

module.exports = route;
