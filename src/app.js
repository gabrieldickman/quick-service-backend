const express = require("express");
const app = express();
const routes = require('./routes/routes');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use(cors());
app.use(express.json());

// Rota para a documentação Swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  // customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Quick Service API Documentation",
  // explorer: true,
}));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (req, res) => {
  res.send("<h1> Home page </h1>");
});

app.use(routes);

module.exports = app;