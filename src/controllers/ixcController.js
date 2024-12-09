const config = require("../config/env")

const error = {
  true: { error: true },
  false: { error: false },
};

const errorMessage = {
  401: "Token nao encontrado",
  404: "Endpoint invalido ",
  505: "Cliente nao encontrado: ",
};

const getClient = async (req, res) => {
  if (!config.token_bd) {
    console.error(new Error("Token nao encontrado"));
    return;
  }
  
  const { id_contrato } = req.query;

  const fetchDataClient = await fetch(
    `${config.endopint_ixc_bd}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(config.token_bd).toString("base64"),
        ixcsoft: "listar",
      },
      body: JSON.stringify({
        qtype: "radusuarios.id",
        query: `${id_contrato}`,
        oper: "=",
        page: "1",
        rp: "20",
        sortname: "radusuarios.id",
        sortorder: "desc",
      }),
    }
  );

  const DataClientValidate = await fetchDataClient;

  if (DataClientValidate.status !== 200) {
    return res.status(DataClientValidate.status).send({
      ...error.true,
      code: DataClientValidate.status,
      message: errorMessage[DataClientValidate.status],
    });
  }
  const DataClienteResponse = await DataClientValidate.json();

  if (DataClienteResponse.total === 0) {
    return res
      .status(404)
      .send({ ...error.true, code: 505, message: errorMessage[505] + id_contrato });
  }
  return res
    .status(200)
    .send(
      JSON.stringify({ ...error.false, data: DataClienteResponse.registros })
    );
};

module.exports = getClient
