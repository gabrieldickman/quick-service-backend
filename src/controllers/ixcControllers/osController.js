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
    505: "OS não encontrada: ",
};





module.exports = async (req, res) => {
    try {
        const { idContrato } = req.query;

        if (!idContrato) {
            return res.status(400).send({ ...error.true, message: errorMessage[400] });
        }

        // Verifica se possui algum token configurado e permitido
        if (!config.token_bd || !config.token_cn || !config.token_364) {
            console.error(new Error(errorMessage[401]));
            return res
                .status(401)
                .send({ ...error.true, message: errorMessage[401] });
        }

        const requestData = {
            // qtype: 'su_oss_chamado.id_contrato_kit',
            // query: `${idContrato}`,
            // oper: '=',
            page: '1',
            rp: '20',
            // sortname: 'su_oss_chamado.id',
            // sortorder: 'desc',
            grid_param: JSON.stringify([{
                TB: 'su_oss_chamado.id_contrato_kit',
                OP: '=',
                P: `${idContrato}`,
            },
            {
                TB: 'su_oss_chamado.status',
                OP: '=',
                P: 'EX',
            },
            ]),
        }

        const endpoints = [
            { url: config.endpoint_os_bd, token: config.token_bd },
            { url: config.endpoint_os_cn, token: config.token_cn },
            { url: config.endpoint_os_364, token: config.token_364 },
        ];

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

        const results = await Promise.all(
            endpoints.map((endpoint) => fetchFromEndpoint(endpoint))
        );

        const validResults = results.filter((result) => result.success && result.data.registros && result.data.registros.length > 0);

        if (validResults.length === 0) {
            return res.status(404).send({
                ...error.true,
                code: 505,
                message: errorMessage[505] + idContrato,
            });
        }

        const filteredData = validResults.map((result) => ({
            os: result.data.registros,
            endpoint: result.endpoint,
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
}