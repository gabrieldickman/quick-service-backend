require('dotenv').config()

const config = {
  // ports
  "server_port" : process.env.PORT_NODE_SERVER || 8001,

  // tokens
  "token_bd" : process.env.TOKEN_BD,
  "token_cn" : process.env.TOKEN_CN,
  "token_364" : process.env.TOKEN_364,
  "token_opa" : process.env.TOKEN_OPA,

  // enpoints
  "endopint_radius_bd" : process.env.ENDPOINT_BD_RADIUS,
  "endpoint_contrato_bd" : process.env.ENDPOINT_BD_CONTRATO
}

module.exports = config;