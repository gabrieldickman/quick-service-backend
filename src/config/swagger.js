const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Quick Service API',
            version: '1.0.0',
            description: `
Documentação da API do Quick Service - Sistema de Gerenciamento de Serviços

## Versionamento
Esta API segue o padrão de versionamento semântico (MAJOR.MINOR.PATCH):
- MAJOR: Alterações incompatíveis com versões anteriores
- MINOR: Adição de funcionalidades mantendo compatibilidade
- PATCH: Correções de bugs mantendo compatibilidade

## Ambientes
- Desenvolvimento: http://localhost:8000
- Homologação: https://hml-api.brasildigital.net.br
- Produção: https://service-api.brasildigital.net.br

## Autenticação
Todas as rotas (exceto /login) requerem autenticação via Bearer Token JWT.
`,
            contact: {
                name: 'Suporte Quick Service',
                email: 'suporte@quickservice.com.br'
            }
        },
        externalDocs: {
            description: 'Documentação do Quick Service',
            url: '/swagger.json'
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Servidor de Desenvolvimento'
            },
            {
                url: 'https://hml-api.brasildigital.net.br',
                description: 'Servidor de Homologação'
            },
            {
                url: 'https://service-api.brasildigital.net.br',
                description: 'Servidor de Produção'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Token de acesso ausente, inválido ou expirado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Não autorizado'
                                    }
                                }
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Erro interno do servidor'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js', './src/controllers/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 