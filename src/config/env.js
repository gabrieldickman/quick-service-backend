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
  "endpoint_radius_bd" : process.env.ENDPOINT_BD_RADIUS,
  "endpoint_contrato_bd" : process.env.ENDPOINT_BD_CONTRATO,

  "endpoint_radius_cn" : process.env.ENDPOINT_CN_RADIUS,
  "endpoint_contrato_cn" : process.env.ENDPOINT_CN_CONTRATO,

  "endpoint_radius_364" : process.env.ENDPOINT_364_RADIUS,
  "endpoint_contrato_364" : process.env.ENDPOINT_364_CONTRATO,

  "endpoint_atendimento_opa" : process.env.ENDPOINT_OPA_ATENDIMENTO,
  "endpoint_atendimento_completo" : process.env.ENDPOINT_OPA_ATENDIMENTO_COMPLETO,
}

module.exports = config;