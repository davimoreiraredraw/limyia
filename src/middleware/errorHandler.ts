import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Erro capturado:", error);

  const apiError: ApiError = {
    message: error.message || "Erro interno do servidor",
    status: 500,
    timestamp: new Date().toISOString(),
  };

  // Se for um erro de validação conhecido
  if (error.name === "ValidationError") {
    apiError.status = 400;
    apiError.message = "Dados de entrada inválidos";
  }

  // Se for um erro de autenticação
  if (error.name === "UnauthorizedError") {
    apiError.status = 401;
    apiError.message = "Não autorizado";
  }

  res.status(apiError.status).json({
    success: false,
    error: apiError.message,
    timestamp: apiError.timestamp,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint não encontrado",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
};
