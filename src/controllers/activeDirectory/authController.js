const jwt = require("jsonwebtoken");
const { ad, switchADServer } = require("../../config/activeDirectory");
require("dotenv").config();

exports.user_authenticate = (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  const usernameWithDomain = `${process.env.AD_DOMAIN}\\${user}`;

  // Primeira tentativa de autenticação com o servidor AD principal
  ad.authenticate(usernameWithDomain, password, (err, auth) => {

    if (err && err.name === "InvalidCredentialsError") {
      console.log(err);
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    if (err) {
      console.error("Erro ao autenticar no AD (IP 1):", err);
      return res.status(500).json({ message: "Erro de conexão com o Active Directory." });
    }
    if (auth) {
      return res.status(200).json({
        message: "Autenticação bem-sucedida!",
        token: jwt.sign({ user }, process.env.JWT_SECRET),
      });
    }
    // Se a autenticação falhar com o primeiro servidor, tenta o segundo
    console.error("Erro de autenticação no AD (IP 1) - Tentando fallback...");

    const adFallback = switchADServer();

    adFallback.authenticate(usernameWithDomain, password, (err2, auth2) => {
      if (err2) {
        console.error("Erro ao autenticar no AD (IP 2):", err2);
        return res.status(500).json({ message: "Erro de conexão com o Active Directory." });
      }

      if (auth2) {
        return res.status(200).json({
          message: "Autenticação bem-sucedida!",
          token: jwt.sign({ user }, process.env.JWT_SECRET),
        });
      }

      console.error("Credenciais inválidas após tentativa de fallback.");
      return res.status(401).json({ message: "Credenciais inválidas." });
    });
  });
};
