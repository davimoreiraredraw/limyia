import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Limyia - Integração OpenAI",
      version: "1.0.0",
      description:
        "API para integração com OpenAI, incluindo sugestões inteligentes para orçamentos",
      contact: {
        name: "Suporte Limyia",
        url: "https://limyia.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Servidor de Desenvolvimento",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Mensagem de erro",
            },
          },
        },
        SugestaoOrcamentoRequest: {
          type: "object",
          required: [
            "tipoProjeto",
            "estado",
            "metragem",
            "valorInformado",
            "margem",
            "cubAtual",
          ],
          properties: {
            tipoProjeto: {
              type: "string",
              example: "interiores",
              description:
                "Tipo do projeto (interiores, render, modelagem, completo)",
            },
            estado: {
              type: "string",
              example: "SP",
              description: "Sigla do estado",
            },
            metragem: {
              type: "number",
              example: 120,
              description: "Área em metros quadrados",
            },
            valorInformado: {
              type: "number",
              example: 2000,
              description: "Valor por m² informado",
            },
            margem: {
              type: "number",
              example: 20,
              description: "Margem de lucro desejada em percentual",
            },
            cubAtual: {
              type: "number",
              example: 2300,
              description: "Valor atual do CUB no estado",
            },
          },
        },
        SugestaoOrcamentoResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            sugestao: {
              type: "string",
              example:
                "Seu valor de R$ 2.000/m² está 13% abaixo do CUB de SP (R$ 2.300/m²). Para manter sua margem de 20%, o ideal seria cobrar ao menos R$ 2.450/m². Considere reposicionar esse valor.",
            },
          },
        },
        ChatRequest: {
          type: "object",
          required: ["messages"],
          properties: {
            messages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                    enum: ["system", "user", "assistant"],
                    example: "user",
                  },
                  content: {
                    type: "string",
                    example: "Olá, como você está?",
                  },
                },
              },
            },
            model: {
              type: "string",
              example: "gpt-3.5-turbo",
            },
            temperature: {
              type: "number",
              example: 0.7,
            },
            max_tokens: {
              type: "number",
              example: 1000,
            },
          },
        },
        ChatResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Olá! Estou bem, como posso ajudar?",
                },
                usage: {
                  type: "object",
                  properties: {
                    prompt_tokens: {
                      type: "number",
                      example: 10,
                    },
                    completion_tokens: {
                      type: "number",
                      example: 20,
                    },
                    total_tokens: {
                      type: "number",
                      example: 30,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Arquivos que contêm as anotações do Swagger
};

export const swaggerSpec = swaggerJsdoc(options);
