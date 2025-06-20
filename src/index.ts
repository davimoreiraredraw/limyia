import dotenv from "dotenv";
// Carregar variáveis de ambiente
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import openaiRoutes from "./routes/openaiRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { swaggerSpec } from "./config/swagger";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003",
];

// Middlewares de segurança e logging
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (como apps mobile ou Postman)
      if (!origin) return callback(null, true);

      // Verificar se a origem está na lista de permitidos
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(morgan("combined"));
app.use(requestLogger);

// Parser de JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
app.use("/docs", swaggerUi.serve);
app.get(
  "/docs",
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Limyia - Documentação",
  })
);

// Rotas
app.use("/api/openai", openaiRoutes);

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "API Limyia - Integração com OpenAI",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/openai/health",
      chat: "POST /api/openai/chat",
      completion: "POST /api/openai/completion",
      image: "POST /api/openai/image",
    },
    documentation: {
      chat: {
        method: "POST",
        url: "/api/openai/chat",
        body: {
          messages: "Array de mensagens com role e content",
          model: "Modelo da OpenAI (opcional)",
          temperature: "Temperatura (opcional)",
          max_tokens: "Máximo de tokens (opcional)",
        },
      },
      completion: {
        method: "POST",
        url: "/api/openai/completion",
        body: {
          prompt: "Texto do prompt",
          model: "Modelo da OpenAI (opcional)",
          temperature: "Temperatura (opcional)",
          max_tokens: "Máximo de tokens (opcional)",
        },
      },
      image: {
        method: "POST",
        url: "/api/openai/image",
        body: {
          prompt: "Descrição da imagem",
          size: "Tamanho da imagem (opcional)",
        },
      },
    },
  });
});

// Middleware de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📖 Documentação disponível em http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/openai/health`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app;
