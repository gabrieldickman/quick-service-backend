const app = require("./app.js");
const env_config = require("./config/env.js");

app.listen(env_config.server_port, () => {
  console.log(`Servidor rodando na porta ${env_config.server_port}`)
})
