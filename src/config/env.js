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
  "endopint_ixc_bd" : process.env.ENDPOINT_BD,
  "endopint_ixc_cn" : process.env.ENDPOINT_CN,
  "endopint_ixc_364" : process.env.ENDPOINT_364,
  "endopint_opa" : process.env.ENDPOINT_OPA,



}

module.exports = config;