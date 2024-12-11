const config = require("../config/env");
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
  505: "Cliente não encontrado: ",
};

const getClient = async (req, res) => {
  try {
    // Verifica se o token está configurado
    if (!config.token_bd) {
      console.error(new Error(errorMessage[401]));
      return res.status(401).send({ ...error.true, message: errorMessage[401] });
    }

    // Obtém o ID do contrato a partir da query
    const { idContrato } = req.query;

    // Faz a requisição para a API
    const response = await axios.post(
      `${config.endpoint_contrato_bd}`,
      {
        qtype: "cliente_contrato.id",
        query: `${idContrato}`,
        oper: "=",
        page: "1",
        rp: "20",
        sortname: "cliente_contrato.id",
        sortorder: "desc",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + Buffer.from(config.token_bd).toString("base64"),
          ixcsoft: "listar",
        },
      }
    );

    // Processa a resposta
    const DataClientResponse = response.data;

    // Verifica se existem registros retornados
    if (!DataClientResponse.registros || DataClientResponse.registros.length === 0) {
      return res.status(404).send({
        ...error.true,
        code: 505,
        message: errorMessage[505] + idContrato,
      });
    }

    // Retorna o primeiro registro com sucesso
    const clienteData = DataClientResponse.registros[0].contrato;
    return res.status(200).send({
      ...error.false,
      data: clienteData,
    });
  } catch (error) {
    // Captura e trata erros inesperados ou erros da API
    console.error("Erro inesperado:", error);
    const status = error.response ? error.response.status : 500;
    const message = errorMessage[status] || "Erro desconhecido";
    return res.status(status).send({
      ...error.true,
      code: status,
      message,
    });
  }
};

module.exports = getClient;
