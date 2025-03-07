# Quick Service Backend

Este é um backend em **Node.js** projetado para coletar e retornar **dados de cadastro de clientes** e **dados de atendimentos** a partir de duas APIs externas:

- **IXC Soft**: Para obter informações sobre os clientes e seus contratos.
- **OPA Suite**: Para obter detalhes sobre atendimentos registrados.

O backend também possui autenticação via **Active Directory** utilizando `activedirectory2` e segue um fluxo de verificação de token JWT para garantir a segurança das requisições.

---

## **Principais Funcionalidades**

- **Autenticação de usuários** via Active Directory e geração de token JWT.
- **Coleta de informações de login do cliente** (IXC Soft).
- **Consulta de cadastro de clientes** (ID e nome).
- **Consulta de plano do cliente** a partir do contrato.
- **Recuperação de atendimentos** via OPA Suite.
- **Proteção das rotas** via middleware de autenticação.

---

## **Estrutura do Projeto**

```
/quick-service-backend
├── /src
│   ├── /config
│   │   ├── activeDirectory.js  # Configuração do Active Directory
│   │   ├── env.js  # Carregamento e tratamento de variáveis de ambiente
│   ├── /controllers
│   │   ├── /activeDirectory
│   │   │   ├── authController.js  # Autenticação via AD
│   │   ├── /ixcControllers
│   │   │   ├── clientecontratoController.js  # Consulta de planos
│   │   │   ├── clienteController.js  # Consulta de clientes
│   │   │   ├── radusuariosController.js  # Consulta de login do cliente
│   │   ├── /opaControllers
│   │   │   ├── atendimentoController.js  # Detalhes do atendimento
│   │   │   ├── opaController.js  # Consulta de protocolo de atendimento
│   ├── /middlewares
│   │   ├── authMiddleware.js  # Middleware de autenticação JWT
│   ├── /routes
│   │   ├── routes.js  # Definição de rotas
│   ├── app.js  # Instancia o Express e configura middlewares
│   └── server.js  # Inicializa o servidor
├── .env  # Variáveis de ambiente
├── Dockerfile  # Configuração do Docker
├── package.json  # Dependências do projeto
└── README.md  # Documentação
```

---

## **Tecnologias Utilizadas**

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) - Ambiente de execução JavaScript
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) - Framework para criação das rotas
- **activedirectory2** - Autenticação via Active Directory
- **jsonwebtoken (JWT)** - Geração e validação de tokens
- **Axios** - Consumo de APIs externas
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) - Containerização do projeto

---

## **Configuração do Ambiente**

Antes de rodar o projeto, configure as variáveis de ambiente no arquivo `.env`:

```
PORT=

# TOKENS DE ACESSO
TOKEN_BD=
TOKEN_CN=
TOKEN_364=
TOKEN_OPA=

# ENDPOINTS DE CONSULTA
ENDPOINT_BD_RADIUS=
ENDPOINT_BD_CONTRATO=
ENDPOINT_BD_CLIENTE=
ENDPOINT_CN_RADIUS=
ENDPOINT_CN_CONTRATO=
ENDPOINT_CN_CLIENTE=
ENDPOINT_364_RADIUS=
ENDPOINT_364_CONTRATO=
ENDPOINT_364_CLIENTE=
ENDPOINT_OPA_ATENDIMENTO=
ENDPOINT_OPA_ATENDIMENTO_COMPLETO=

# ACTIVE DIRECTORY
AD_DOMAIN=
AD_IP_RANGE1=
AD_IP_RANGE2=
AD_PORT=
AD_USER=
AD_PASSWORD=
JWT_SECRET=

```

Para rodar o backend:

```
npm install
npm start = produção
npm run dev = desenvolvimento
```

---

## **Autenticação**

A autenticação é feita via **Active Directory**. O usuário faz login enviando seu login e senha, e, caso seja autenticado, recebe um **JWT** para acessar as demais rotas protegidas.

Exemplo de login:

**Requisição:**
```http
POST /login
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## **Rotas da API**

### **Autenticação**

- **`POST /login`** - Autentica o usuário via AD e retorna um JWT.

### **Clientes (IXC Soft)**

- **`GET /api/v1/cliente/radius`** - Retorna informações do login PPPoE do cliente, como login, senha e interface de conexão.
- **`GET /api/v1/cliente/cadastro`** - Retorna ID e nome do cliente.
- **`GET /api/v1/cliente/plano`** - Consulta o nome do plano de internet do cliente a partir do contrato.

### **Atendimentos (OPA Suite)**

- **`GET /api/v1/opa`** - Consulta um atendimento a partir do protocolo.
- **`GET /api/v1/opa/atendimento`** - Retorna detalhes do atendimento:
  - Nome do atendente
  - Nome do titular da conta
  - Nome de quem entrou em contato
  - Telefone de contato
  - Protocolo do atendimento
  - Data do atendimento
  - Motivo do atendimento (ex: lentidão, sem conexão, etc.)

**Todas as rotas protegidas exigem envio de token JWT no cabeçalho:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

---

## **Execução com Docker**

Para rodar o backend via Docker:

```sh
docker build -t quick-service-backend .
docker run -p 8000:8000 quick-service-backend
```

---


