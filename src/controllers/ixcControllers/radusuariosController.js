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
  505: "Cliente não encontrado: ",
};

const getLogin = async (req, res) => {
  try {
    // Verifica se possui algum token configurado e permitido
    if (!config.token_bd || !config.token_cn || !config.token_364) {
      console.error(new Error(errorMessage[401]));
      return res
        .status(401)
        .send({ ...error.true, message: errorMessage[401] });
    }

    let requestData = {};
    let query = "";

    if (req.query.login) {

      const { login } = req.query;
      query = login;
      requestData = {
        qtype: "radusuarios.login",
        query: `${login}`,
        oper: "=",
        page: "1",
        rp: "20",
        sortname: "radusuarios.id",
        sortorder: "desc",
      };
    } else {
      const { idCliente } = req.query;

      query = idCliente;

      requestData = {
        qtype: "radusuarios.id_cliente",
        query: `${idCliente}`,
        oper: "=",
        page: "1",
        rp: "20",
        sortname: "radusuarios.id",
        sortorder: "desc",
      };
    }

    // Lista de endpoints e tokens para consulta
    const endpoints = [
      { url: config.endpoint_radius_bd, token: config.token_bd },
      { url: config.endpoint_radius_cn, token: config.token_cn },
      { url: config.endpoint_radius_364, token: config.token_364 },
    ];

    // Função para consultar um único endpoint
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
      } catch (err) {
        return {
          success: false,
          error: err,
          endpoint: url,
        };
      }
    };

    // Faz a consulta em todos os endpoints simultaneamente
    const results = await Promise.all(
      endpoints.map((endpoint) => fetchFromEndpoint(endpoint))
    );

    // Filtra os resultados com sucesso e registros válidos
    const validResults = results.filter((result) => result.success && result.data.registros && result.data.registros.length > 0);

    if (validResults.length === 0) {
      return res.status(404).send({
        ...error.true,
        code: 505,
        message: errorMessage[505] + query,
      });
    }

    // Filtra e estrutura os dados necessários (login, senha e idPlano)
    const filteredData = validResults.map((result) => ({
      logins: result.data.registros,
      // login: result.data.registros[0].login,
      // senha: result.data.registros[0].senha,
      // idPlano: result.data.registros[0].id_contrato,
      // interfaceConexão: result.data.registros[0].conexao,
      endpoint: result.endpoint, // Indica qual endpoint retornou o dado
    }));

    return res.status(200).send({
      ...error.false,
      data: filteredData,
    });
  } catch (error) {
    // Erros
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

const putLogin = async (req, res) => {
  try {
    const { login, senha, endpoint, id_cliente, id_grupo, autenticacao, id_contrato } = req.body;

    const { id } = req.query;

    if (!id) {
      return res.status(400).send({ ...error.true, message: "ID do cliente não informado" });
    }

    if (!login || !senha || !endpoint) {
      return res.status(400).send({ ...error.true, message: "Login, senha e endpoint não informados" });
    }

    if (!id_cliente || !id_grupo) {
      return res.status(400).send({ ...error.true, message: "ID do cliente e ID do grupo não informados" });
    }

    if (!endpoint) {
      return res.status(400).send({ ...error.true, message: "Endpoint não informado" });
    }

    if (!autenticacao) {
      return res.status(400).send({ ...error.true, message: "Tipo de autenticação não informado" });
    }

    const tipoAutenticacao = {
      PPPoE: "L",
      IPoE: "D"
    }

    const requestData = {
      login: login,
      senha: senha,
      autenticacao_por_mac: "P",
      ativo: "S",
      tipo_conexao_mapa: "F",
      relacionar_concentrador_ao_login: "H",
      auto_preencher_ip: "H",
      auto_preencher_mac: "H",
      id_cliente,
      id_grupo,
      relacionar_ip_ao_login: "H",
      login_simultaneo: "1",
      relacionar_mac_ao_login: "H",
      autenticacao: tipoAutenticacao[autenticacao],
      tipo_vinculo_plano: "D",
      fixar_ip: "H",
      senha_md5: "N",
      id_contrato,
    };

    const endpoints = [
      { url: config.endpoint_radius_bd, token: config.token_bd },
      { url: config.endpoint_radius_cn, token: config.token_cn },
      { url: config.endpoint_radius_364, token: config.token_364 },
    ];

    const endpointApi = endpoints.find((e) => e.url.includes(endpoint));

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(endpointApi.token).toString("base64"),
    };

    const response = await axios.put(`${endpointApi.url}/${id}`, requestData, { headers });

    if (response.data.type === "error") {
      return res.status(400).send({ ...error.true, message: response.data.message, code: 400 });
    }

    return res.status(200).send({ ...error.false, data: response.data });
  } catch (error) {
    // Erros
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

module.exports = { getLogin, putLogin };
