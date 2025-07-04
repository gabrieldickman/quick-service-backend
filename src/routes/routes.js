const express = require("express");
const route = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const authController = require("../controllers/activeDirectory/authController");

const radusuariosController = require("../controllers/ixcControllers/radusuariosController");
const clientecontratoController = require("../controllers/ixcControllers/clientecontratoController");
const clienteController = require("../controllers/ixcControllers/clienteController");
const osController = require("../controllers/ixcControllers/osController");


const opaController = require("../controllers/opaControllers/opaController");
const atendimentoController = require("../controllers/opaControllers/atendimentoController");

/**
 * @swagger
 * /login:
 *   post:
 *     security: []
 *     summary: Autenticação de usuário
 *     description: |
 *       Endpoint para autenticação de usuários no sistema Quick Service.
 *       Este endpoint valida as credenciais do usuário contra o Active Directory e retorna um token JWT.
 *       
 *       ### Uso do Token
 *       O token retornado deve ser incluído no header Authorization de todas as requisições subsequentes:
 *       ```
 *       Authorization: Bearer <token>
 *       ```
 *       
 *       ### Validade do Token
 *       O token tem validade de 24 horas após sua emissão.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - password
 *             properties:
 *               user:
 *                 type: string
 *                 description: Nome de usuário do Active Directory
 *                 example: "joao.silva"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                   example: "Login realizado com sucesso"
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário ou senha inválidos"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post("/login", authController.user_authenticate);

/**
 * @swagger
 * /api/v1/cliente/radius:
 *   get:
 *     summary: Buscar informações do RADIUS do cliente
 *     description: |
 *       Retorna os dados de autenticação RADIUS do cliente.
 *       
 *       ### Dados Retornados
 *       - Informações de autenticação PPPoE
 *       - Status da conexão
 *       - Histórico de conexões
 *       - Dados de consumo
 *       
 *       ### Observações
 *       - Os dados são atualizados a cada 5 minutos
 *       - O consumo é calculado com base no tráfego de entrada e saída
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idCliente
 *         in: query
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do plano retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       logins:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             autenticacao_por_mac:
 *                               type: string
 *                               example: "P"
 *                             relacionamento_concentrador_ao_login:
 *                               type: string
 *                               example: "H"
 *                             agent_circuit_id:
 *                               type: string
 *                               example: ""
 *                             pool_radius:
 *                               type: string
 *                               example: "0"
 *                             id_rad_dns:
 *                               type: string
 *                               example: "0"
 *                             modelo_tranmissor:
 *                               type: string
 *                               example: ""
 *                             auto_preencher_ipv6:
 *                               type: string
 *                               example: "H"
 *                             fixar_ipv6:
 *                               type: string
 *                               example: "H"
 *                             relacionar_ipv6_ao_login:
 *                               type: string
 *                               example: "H"
 *                             ip_aux:
 *                               type: string
 *                               example: ""
 *                             porta_aux:
 *                               type: string
 *                               example: "0"
 *                             id_radgrupos_pools:
 *                               type: string
 *                               example: "0"
 *                             service_tag_vlan:
 *                               type: string
 *                               example: "N"
 *                             acct_session_id:
 *                               type: string
 *                               example: "jnpr demux0.3221432575:917551145"
 *                             senha_rede_sem_fio_5ghz:
 *                               type: string
 *                               example: ""
 *                             ssid_router_wifi_5ghz:
 *                               type: string
 *                               example: ""
 *                             mtu:
 *                               type: string
 *                               example: "1500"
 *                             onu_compartilhada:
 *                               type: string
 *                               example: ""
 *                             id_reserva_rede_neutra:
 *                               type: string
 *                               example: "0"
 *                             tipo_acesso:
 *                               type: string
 *                               example: "http"
 *                             usuario_wpa2aes:
 *                               type: string
 *                               example: ""
 *                             senha_wpa2aes:
 *                               type: string
 *                               example: ""
 *                             pacote_lte:
 *                               type: string
 *                               example: ""
 *                             id:
 *                               type: string
 *                               example: "65664"
 *                             ativo:
 *                               type: string
 *                               example: "S"
 *                             online:
 *                               type: string
 *                               example: "S"
 *                             tipo_conexao_mapa:
 *                               type: string
 *                               example: "F"
 *                             id_contrato:
 *                               type: string
 *                               example: "11508"
 *                             id_grupo:
 *                               type: string
 *                               example: "230"
 *                             id_cliente:
 *                               type: string
 *                               example: "3"
 *                             login:
 *                               type: string
 *                               example: "reinaldo"
 *                             obs:
 *                               type: string
 *                               example: ""
 *                             senha:
 *                               type: string
 *                               example: "reinaldo"
 *                             auto_preencher_ip:
 *                               type: string
 *                               example: "H"
 *                             ip:
 *                               type: string
 *                               example: "100.64.82.203"
 *                             auto_preencher_mac:
 *                               type: string
 *                               example: "H"
 *                             pd_ipv6:
 *                               type: string
 *                               example: "2804:1128:bc48:8d00::/56"
 *                             mac:
 *                               type: string
 *                               example: "9C:63:5B:E5:A0:7A"
 *                             endereco:
 *                               type: string
 *                               example: ""
 *                             numero:
 *                               type: string
 *                               example: ""
 *                             complemento:
 *                               type: string
 *                               example: ""
 *                             relacionar_ip_ao_login:
 *                               type: string
 *                               example: "H"
 *                             bairro:
 *                               type: string
 *                               example: ""
 *                             relacionar_mac_ao_login:
 *                               type: string
 *                               example: "H"
 *                             conexao:
 *                               type: string
 *                               example: "ZTEGD42DDE1E:BRD.PVO.VLV.COD:2:15"
 *                             id_concentrador:
 *                               type: string
 *                               example: "2"
 *                             latitude:
 *                               type: string
 *                               example: "-8.7624799"
 *                             longitude:
 *                               type: string
 *                               example: "-63.8845687"
 *                             concentrador:
 *                               type: string
 *                               example: "10.200.1.201"
 *                             tipo_conexao:
 *                               type: string
 *                               example: "Ethernet"
 *                             ultima_conexao_inicial:
 *                               type: string
 *                               example: "2025-04-21 19:36:15"
 *                             ultima_conexao_final:
 *                               type: string
 *                               example: ""
 *                             interface:
 *                               type: string
 *                               example: "0"
 *                             tempo_conectado:
 *                               type: string
 *                               example: "15600"
 *                             franquia_maximo:
 *                               type: string
 *                               example: "0"
 *                             franquia_consumo:
 *                               type: string
 *                               example: "0.00000"
 *                             autenticacao:
 *                               type: string
 *                               example: "L"
 *                             login_simultaneo:
 *                               type: string
 *                               example: "1"
 *                             senha_md5:
 *                               type: string
 *                               example: "N"
 *                             fixar_ip:
 *                               type: string
 *                               example: "H"
 *                             ip_aviso:
 *                               type: string
 *                               example: "100.64.82.203"
 *                             porta_http:
 *                               type: string
 *                               example: "0"
 *                             porta_router2:
 *                               type: string
 *                               example: "0"
 *                             id_transmissor:
 *                               type: string
 *                               example: "0"   
 *                             id_caixa_ftth:
 *                               type: string
 *                               example: "0"
 *                             ftth_porta:
 *                               type: string
 *                               example: "0"
 *                             senha_router1:
 *                               type: string
 *                               example: ""
 *                             senha_router2:
 *                               type: string
 *                               example: ""
 *                             senha_rede_sem_fio:
 *                               type: string
 *                               example: ""
 *                             id_porta_transmissor:
 *                               type: string
 *                               example: "0"
 *                             cliente_tem_a_senha:
 *                               type: string
 *                               example: "N"
 *                             franquia_atingida:
 *                               type: string
 *                               example: "N"
 *                             autenticacao_wps:
 *                               type: string
 *                               example: "N"
 *                             id_df_projeto:
 *                               type: string
 *                               example: "0"
 *                             autenticacao_mac:
 *                               type: string
 *                               example: "N"
 *                             motivo_desconexao:
 *                               type: string
 *                               example: ""
 *                             autenticacao_wpa:
 *                               type: string
 *                               example: ""
 *                             tempo_conexao:
 *                               type: string
 *                               example: "0"
 *                             tipo_vinculo_plano:
 *                               type: string
 *                               example: "D"
 *                             count_desconexao:
 *                               type: string
 *                               example: "0"
 *                             onu_mac:
 *                               type: string
 *                               example: ""
 *                             vlan:
 *                               type: string
 *                               example: "0"
 *                             vlan_ip_rede:
 *                               type: string
 *                               example: ""
 *                             id_hardware:
 *                               type: string
 *                               example: "0"
 *                             id_condominio:
 *                               type: string
 *                               example: "0"
 *                             tipo_equipamento:
 *                               type: string
 *                               example: ""
 *                             metragem_interna:
 *                               type: string
 *                               example: "0"
 *                             metragem_externa:
 *                               type: string
 *                               example: "0"
 *                             tronco:
 *                               type: string
 *                               example: ""
 *                             splitter:
 *                               type: string
 *                               example: "0"
 *                             sinal_ultimo_atendimento:
 *                               type: string
 *                               example: ""
 *                             interface_transmissao:
 *                               type: string
 *                               example: "0"
 *                             franquia_consumo_up: 
 *                               type: string
 *                               example: "0.00000"
 *                             endereco_padrao_cliente:
 *                               type: string
 *                               example: "S"
 *                             cidade:
 *                               type: string
 *                               example: "0"
 *                             cep:
 *                               type: string
 *                               example: ""
 *                             referencia:  
 *                               type: string
 *                               example: ""
 *                             ssid_router_wifi:
 *                               type: string
 *                               example: ""
 *                             bloco:
 *                               type: string
 *                               example: ""
 *                             apartamento:
 *                               type: string
 *                               example: "0"
 *                             usuario_router1: 
 *                               type: string
 *                               example: ""
 *                             upload_atual:
 *                               type: string
 *                               example: "121490771"
 *                             download_atual:
 *                               type: string
 *                               example: "4831852155"
 *                             gw_vlan:
 *                               type: string
 *                               example: ""
 *                             id_filial:
 *                               type: string
 *                               example: "1"
 *                             ponta:
 *                               type: string
 *                               example: ""
 *                             ultima_atualizacao:
 *                               type: string
 *                               example: "2025-04-22 00:00:27"
 *                             framed_fixar_ipv6:
 *                               type: string
 *                               example: "H"
 *                             framed_autopreencher_ipv6:
 *                               type: string
 *                               example: "H"
 *                             framed_relacionar_ipv6_ao_login:
 *                               type: string
 *                               example: "H"
 *                             framed_pd_ipv6:
 *                               type: string
 *                               example: "2804:1128:8100:163d::/64"
 *                             lte_id:
 *                               type: string
 *                               example: ""
 *                             id_integracao:
 *                               type: string
 *                               example: "0"
 *                       endpoint:
 *                         type: string
 *                         example: "https://ixc.brasildigital.net.br/webservice/v1/radusuarios"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get("/api/v1/cliente/radius", verificarToken, radusuariosController.getLogin);

/**
 * @swagger
 * /api/v1/cliente/radius:
 *   put:
 *     summary: Atualizar login e senha do cliente
 *     description: |
 *       Atualiza o login e a senha do cliente no sistema RADIUS.
 *       
 *       ### Parâmetros
 *       - login: Login do cliente
 *       - senha: Nova senha do cliente
 *       - endpoint: Endpoint do Sistema
 *       
 *       ### Observações
 *       - O endpoint deve ser um dos seguintes:
 *         - https://ixc.brasildigital.net.br/webservice/v1/radusuarios (BD)
 *         - https://ixc.candeiasnet.com.br/webservice/v1/radusuarios (CN)
 *         - https://ixc.364telecom.com.br/webservice/v1/radusuarios (364)
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *               - endpoint
 *               - id_cliente
 *               - id_grupo
 *               - autenticacao
 *               - id_contrato
 *             properties:
 *               login: 
 *                 type: string
 *                 example: "reinaldo"
 *               senha:
 *                 type: string
 *                 example: "reinaldo"
 *               endpoint:
 *                 type: string
 *                 example: "https://ixc.brasildigital.net.br/webservice/v1/radusuarios"
 *               id_cliente:
 *                 type: string
 *                 example: "1"
 *               id_grupo:
 *                 type: string
 *                 example: "1"
 *               autenticacao:
 *                 type: enum
 *                 enum:
 *                   - PPPoE
 *                   - IPoE
 *                 example: "PPPoE"
 *               id_contrato:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Login e senha atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: "Login e senha atualizados com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

route.put("/api/v1/cliente/radius", verificarToken, radusuariosController.putLogin);

/**
 * @swagger
 * /api/v1/cliente/plano:
 *   get:
 *     summary: Buscar informações do plano do cliente
 *     description: |
 *       Retorna os dados detalhados do plano contratado pelo cliente.
 *       
 *       ### Dados Retornados
 *       - Informações do plano atual
 *       - Velocidade contratada
 *       - Valor da mensalidade
 *       - Data de vencimento
 *       - Histórico de pagamentos
 *       
 *       ### Regras de Negócio
 *       - Clientes com pagamentos em atraso terão status "bloqueado"
 *       - Alterações de plano são refletidas no próximo ciclo de faturamento
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idContrato
 *         in: query
 *         required: true
 *         description: ID do contrato
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do plano retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: "COMBO PLANOS DE INTERNET"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get("/api/v1/cliente/plano", verificarToken, clientecontratoController);

/**
 * @swagger
 * /api/v1/cliente/cadastro:
 *   get:
 *     summary: Buscar dados cadastrais do cliente
 *     description: |
 *       Retorna os dados cadastrais completos do cliente.
 *       
 *       ### Dados Retornados
 *       - Informações pessoais
 *       - Endereço de instalação
 *       - Documentos
 *       - Contatos
 *       
 *       ### Observações
 *       - Dados sensíveis são mascarados parcialmente
 *       - Alterações cadastrais devem ser solicitadas via atendimento
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados cadastrais retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                   example: "João da Silva"
 *                 cpf:
 *                   type: string
 *                   example: "***.***.***-**"
 *                 email:
 *                   type: string
 *                   example: "joao.silva@email.com"
 *                 telefone:
 *                   type: string
 *                   example: "(11) 98765-4321"
 *                 endereco:
 *                   type: object
 *                   properties:
 *                     logradouro:
 *                       type: string
 *                       example: "Rua das Flores"
 *                     numero:
 *                       type: string
 *                       example: "123"
 *                     complemento:
 *                       type: string
 *                       example: "Apto 45"
 *                     bairro:
 *                       type: string
 *                       example: "Centro"
 *                     cidade:
 *                       type: string
 *                       example: "São Paulo"
 *                     estado:
 *                       type: string
 *                       example: "SP"
 *                     cep:
 *                       type: string
 *                       example: "01234-567"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get("/api/v1/cliente/cadastro", verificarToken, clienteController);

/**
 * @swagger
 * /api/v1/opa:
 *   get:
 *     summary: Buscar informações do OPA
 *     description: |
 *       Retorna dados do sistema OPA (Operações e Atendimento).
 *       
 *       ### Dados Retornados
 *       - Status dos serviços
 *       - Indicadores de desempenho
 *       - Métricas de atendimento
 *       
 *       ### Observações
 *       - Dados são atualizados em tempo real
 *       - Métricas são calculadas com base nos últimos 30 dias
 *     tags: [OPA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: protocolo
 *         in: query
 *         required: true
 *         description: Protocolo do atendimento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do OPA retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: string
 *                   example: "677812aadf0998"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get("/api/v1/opa", verificarToken, opaController);

/**
 * @swagger
 * /api/v1/opa/atendimento:
 *   get:
 *     summary: Buscar informações de atendimento
 *     description: |
 *       Retorna dados detalhados de atendimento do sistema OPA.
 *       
 *       ### Dados Retornados
 *       - Histórico de atendimentos
 *       - Status dos chamados
 *       - Interações com o cliente
 *       - Protocolos de atendimento
 *       
 *       ### Regras de Negócio
 *       - Atendimentos são ordenados por data (mais recente primeiro)
 *       - Apenas atendimentos dos últimos 90 dias são retornados
 *       - Chamados em aberto têm prioridade na listagem
 *     tags: [OPA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idAtendimento
 *         in: query
 *         required: true
 *         description: ID do atendimento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados de atendimento retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     nomeDoAtendente:
 *                       type: string
 *                       example: "Walisson Pimenta Gois"
 *                     nomeDoTitular:
 *                       type: string
 *                       example: "ELIANA MAGALHAES DA SILVA"
 *                     nomeDoContatante:
 *                       type: string
 *                       example: "liana Magalhães"
 *                     telefoneDoContatante:
 *                       type: string
 *                       example: "5597984254670@c.us"
 *                     protocoloDoAtendimento:
 *                       type: string
 *                       example: "OPA20251745898"
 *                     dataDoAtendimento:
 *                       type: string
 *                       example: "2025-04-02T12:23:44.845Z"
 *                     motivoDoChamado:
 *                       type: string
 *                       example: "Alteração/solicitação de senha/nome do WiFi"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get("/api/v1/opa/atendimento", verificarToken, atendimentoController);

/**
 * @swagger
 * /api/v1/os:
 *   get:
 *     summary: Buscar informações da OS
 *     description: |
 *       Retorna dados detalhados da OS.
 *     tags: [OS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idContrato
 *         in: query
 *         required: true
 *         description: ID do contrato
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados da OS retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       os:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "1234567890"
 *                             status:
 *                               type: string
 *                               example: "EX"
 *                             id_contrato_kit:
 *                               type: string
 *                               example: "1234567890"
 *                             setor:
 *                               type: string
 *                               example: "12"
 *                             data_abertura:
 *                               type: string
 *                               example: "2025-06-02 19:31:44"
 *                             data_fechamento:
 *                               type: string
 *                               example: "2025-06-02 19:31:44"
 *                             id_cliente:
 *                               type: string
 *                               example: "1234567890"
 *                             funcionario:
 *                               type: string
 *                               example: "José da Silva"
*                       endpoint:
*                         type: string
*                         example: "https://ixcsoft.com.br/webservice/v1/su_oss_chamado"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get("/api/v1/os", verificarToken, osController);

module.exports = route;
