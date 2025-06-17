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
  505: "Plano não encontrado: ",
};

const getPlanoCliente = async (req, res) => {
  try {
    if (!config.token_bd) {
      console.error(new Error(errorMessage[401]));
      return res
        .status(401)
        .send({ ...error.true, message: errorMessage[401] });
    }

    const { idContrato } = req.query;

    // Lista de endpoints e tokens para consulta
    const endpoints = [
      { url: config.endpoint_contrato_bd, token: config.token_bd },
      { url: config.endpoint_contrato_cn, token: config.token_cn },
      { url: config.endpoint_contrato_364, token: config.token_364 },
    ];

    const requestData = {
      qtype: "cliente_contrato.id",
      query: `${idContrato}`,
      oper: "=",
      page: "1",
      rp: "20",
      sortname: "cliente_contrato.id",
      sortorder: "desc",
    };

    const fetchFromEndpoint = async ({ url, token }) => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Basic " + Buffer.from(token).toString("base64"),
          ixcsoft: "listar",
        };

        const response = await axios.post(url, requestData, { headers });

        return {
          success: true,
          data: response.data,
          endpoint: url,
        };
      } catch (error) {
        console.error("Erro ao buscar dados do endpoint:", error);
        return {
          success: false,
          error: error,
          endpoint: url,
        };
      }
    };

    const results = await Promise.all(endpoints.map(fetchFromEndpoint));


    // Filtra os resultados com sucesso e registros válidos
    const validResults = results.filter((result) => result.success && result.data.registros && result.data.registros.length > 0);

    if (validResults.length === 0) {
      return res.status(404).send({
        ...error.true,
        code: 505,
        message: errorMessage[505] + idContrato,
      });
    }

    const DataClientResponse = validResults.map((result) => ({
      contratos: result.data.registros,
      endpoint: result.endpoint, // Indica qual endpoint retornou o dado
    }));

    if (DataClientResponse.length === 0) {
      return res.status(404).send({
        ...error.true,
        code: 505,
        message: errorMessage[505] + idContrato + " - " + DataClientResponse[0].endpoint,
      });
    }

    return res.status(200).send({
      ...error.false,
      data: DataClientResponse,
    });
  } catch (error) {
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

module.exports = getPlanoCliente;