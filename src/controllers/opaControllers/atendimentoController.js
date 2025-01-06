const config = require("../../config/env.js");
const axios = require("axios");

const error = {
  true: { error: true },
  false: { error: false },
};

const errorMessage = {
  400: "Requisição inválida",
  401: "Token não encontrado",
  403: "Acesso proibido",
  404: "Endpoint inválido",
  500: "Erro interno do servidor",
  502: "Bad Gateway",
  503: "Serviço indisponível",
  504: "Gateway Timeout",
  505: "Atendimento não encontrado: ",
};

const getAtendimento = async (req, res) => {
  try {
    if (!config.token_opa) {
      console.error(new Error(errorMessage[401]));
      return res
        .status(401)
        .send({ ...error.true, message: errorMessage[401] });
    }

    const { idAtendimento } = req.query;

    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${config.endpoint_atendimento_completo}${idAtendimento}`,
      headers: {
        Authorization: `Bearer ${config.token_opa}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data.data;

    const clientData = {
      // fulldata: responseData,
      atendente: responseData.id_atendente.nome,
      cliente: responseData.id_cliente.nome,
      fone: responseData.canal_cliente,
      protocolo: responseData.protocolo,
    };

    return res.status(200).send({
      ...error.false,
      data: clientData,
    });
  } catch (error) {
    console.error("Erro inesperado:", error.message);
    if (error.response) {
      console.error("Status de erro:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    }
    const status = error.response ? error.response.status : 500;
    const message = errorMessage[status] || "Erro desconhecido";
    return res.status(status).send({
      ...error.true,
      code: status,
      message,
    });
  }
};

module.exports = getAtendimento;
