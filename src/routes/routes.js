const express = require("express");
const route = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const authController = require("../controllers/activeDirectory/authController"); // Importando o controller de autenticação

const radusuariosController = require("../controllers/ixcControllers/radusuariosController");
const clientecontratoController = require("../controllers/ixcControllers/clientecontratoController");
const clienteController = require("../controllers/ixcControllers/clienteController");

const opaController = require("../controllers/opaControllers/opaController");
const atendimentoController = require("../controllers/opaControllers/atendimentoController");

route.post("/login", authController.user_authenticate);

route.get("/cliente/radius", verificarToken, radusuariosController);
route.get("/cliente/plano", verificarToken, clientecontratoController);
route.get("/cliente/cadastro", verificarToken, clienteController);
route.get("/opa", verificarToken, opaController);
route.get("/opa/atendimento", verificarToken, atendimentoController);

module.exports = route;
