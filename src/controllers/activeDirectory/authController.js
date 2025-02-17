const jwt = require("jsonwebtoken");
const { ad, switchADServer } = require("../../config/activeDirectory");
require("dotenv").config();

exports.user_authenticate = (req, res) => {
      
  const { user, password } = req.body;

  // Verifica se o usuário e a senha foram fornecidos
  if (!user || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
  }

  // Formata o nome de usuário com o domínio (ex: "DOMINIO\\usuario")
  const usernameWithDomain = `${process.env.AD_DOMAIN}\\${user}`;

  // Primeira tentativa de autenticação com o servidor AD principal
  ad.authenticate(usernameWithDomain, password, (err, auth) => {
    if (err) {
      console.error("Erro ao autenticar no AD (IP 1):", err);
      return res.status(500).json({ message: "Erro de conexão com o Active Directory." });
    }

    // Se a autenticação for bem-sucedida, gera o token JWT
    if (auth) {
      return res.status(200).json({
        message: "Autenticação bem-sucedida!",
        token: jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" }), // Gera o token com expiração de 1 hora
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

      // Se a autenticação for bem-sucedida com o segundo servidor, gera o token JWT
      if (auth2) {
        return res.status(200).json({
          message: "Autenticação bem-sucedida!",
          token: jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" }),
        });
      }

      // Se não conseguir autenticar em nenhum servidor
      console.error("Credenciais inválidas após tentativa de fallback.");
      return res.status(401).json({ message: "Credenciais inválidas." });
    });
  });
};
