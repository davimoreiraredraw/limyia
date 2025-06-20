import { Request, Response } from "express";
import openaiService from "../services/openaiService";
import supabaseService from "../services/supabaseService";
import {
  ChatRequest,
  CompletionRequest,
  SugestaoOrcamentoRequest,
  ApiError,
} from "../types";

export class OpenAIController {
  async chatCompletion(req: Request, res: Response) {
    try {
      const { messages, model, temperature, max_tokens }: ChatRequest =
        req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Mensagens são obrigatórias e devem ser um array não vazio",
        });
      }

      const result = await openaiService.chatCompletion({
        messages,
        model,
        temperature,
        max_tokens,
      });

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro no controller de chat:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  async textCompletion(req: Request, res: Response) {
    try {
      const { prompt, model, temperature, max_tokens }: CompletionRequest =
        req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          success: false,
          error: "Prompt é obrigatório e deve ser uma string",
        });
      }

      const result = await openaiService.textCompletion({
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro no controller de completion:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  async generateImage(req: Request, res: Response) {
    try {
      const { prompt, size } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          success: false,
          error: "Prompt é obrigatório e deve ser uma string",
        });
      }

      const result = await openaiService.generateImage(prompt, size);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro no controller de geração de imagem:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  async healthCheck(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: "API está funcionando corretamente",
      timestamp: new Date().toISOString(),
    });
  }

  async sugestaoOrcamentoIA(req: Request, res: Response) {
    try {
      const dados: SugestaoOrcamentoRequest = req.body;
      // Validação básica
      if (
        !dados.tipoProjeto ||
        !dados.estado ||
        !dados.metragem ||
        !dados.valorInformado ||
        !dados.margem ||
        !dados.cubAtual
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Todos os campos são obrigatórios: tipoProjeto, estado, metragem, valorInformado, margem, cubAtual",
        });
      }
      const result = await openaiService.sugestaoOrcamentoIA(dados);
      if (!result.success) {
        return res.status(500).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro no controller de sugestão IA:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  async getUserMessages(req: Request, res: Response) {
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
          error instanceof Error ? error.message : "Erro interno do servidor",
        status: 500,
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(apiError);
    }
  }
}

export default new OpenAIController();
