require('dotenv').config()

const config = {
  // PORTS
  "server_port": process.env.PORT || 8000,

  // TOKENS DE ACESSO
  "token_bd": process.env.TOKEN_BD,
  "token_cn": process.env.TOKEN_CN,
  "token_364": process.env.TOKEN_364,
  "token_opa": process.env.TOKEN_OPA,

  // ENDPOITNS DE CONSULTA
  "endpoint_radius_bd": process.env.ENDPOINT_BD_RADIUS,
  "endpoint_contrato_bd": process.env.ENDPOINT_BD_CONTRATO,
  "endpoint_cliente_bd": process.env.ENDPOINT_BD_CLIENTE,
  "endpoint_os_bd": process.env.ENDPOINT_BD_OS,
  "endpoint_radius_cn": process.env.ENDPOINT_CN_RADIUS,
  "endpoint_contrato_cn": process.env.ENDPOINT_CN_CONTRATO,
  "endpoint_cliente_cn": process.env.ENDPOINT_CN_CLIENTE,
  "endpoint_os_cn": process.env.ENDPOINT_CN_OS,
  "endpoint_radius_364": process.env.ENDPOINT_364_RADIUS,
  "endpoint_contrato_364": process.env.ENDPOINT_364_CONTRATO,
  "endpoint_cliente_364": process.env.ENDPOINT_364_CLIENTE,
  "endpoint_os_364": process.env.ENDPOINT_364_OS,
  "endpoint_atendimento_opa": process.env.ENDPOINT_OPA_ATENDIMENTO,
  "endpoint_atendimento_completo": process.env.ENDPOINT_OPA_ATENDIMENTO_COMPLETO,
}

module.exports = config;