import { Request, Response, RequestHandler } from "express";
import openaiService from "../services/openaiService";
import supabaseService from "../services/supabaseService";
import {
  ChatRequest,
  CompletionRequest,
  SugestaoOrcamentoRequest,
  ApiError,
} from "../types";

export const healthCheck: RequestHandler = (_req, res) => {
  res.json({ status: "OK" });
};

export const chat: RequestHandler = async (req, res) => {
  try {
    const chatRequest: ChatRequest = req.body;
    const response = await openaiService.chatCompletion(chatRequest);
    res.json(response);
  } catch (error) {
    console.error("Erro no chat:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erro interno no servidor",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

export const completion: RequestHandler = async (req, res) => {
  try {
    const completionRequest: CompletionRequest = req.body;
    const response = await openaiService.textCompletion(completionRequest);
    res.json(response);
  } catch (error) {
    console.error("Erro no completion:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erro interno no servidor",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

export const generateImage: RequestHandler = async (req, res) => {
  try {
    const { prompt, size } = req.body;
    const response = await openaiService.generateImage(prompt, size);
    res.json(response);
  } catch (error) {
    console.error("Erro na geração de imagem:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erro interno no servidor",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

export const sugestaoOrcamento: RequestHandler = async (req, res) => {
  try {
    const dados: SugestaoOrcamentoRequest = req.body;
    const response = await openaiService.sugestaoOrcamentoIA(dados);
    res.json(response);
  } catch (error) {
    console.error("Erro na sugestão de orçamento:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erro interno no servidor",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

export const getUserMessages = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      const error: ApiError = {
        message: "ID do usuário não fornecido",
        status: 400,
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(error);
    }

    const messages = await supabaseService.getUserMessages(userId);
    return res.json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : "Erro interno no servidor",
      status: 500,
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(apiError);
  }
};
