import OpenAI from "openai";
import {
  ChatRequest,
  ChatResponse,
  CompletionRequest,
  CompletionResponse,
  SugestaoOrcamentoRequest,
  SugestaoOrcamentoResponse,
  CreateAIMessageHistory,
} from "../types";
import supabaseService from "./supabaseService";

class OpenAIService {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log(process.env.OPENAI_API_KEY);
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY não configurada no ambiente");
    }

    this.client = new OpenAI({
      apiKey: apiKey,
    });

    this.defaultModel = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
  }

  async chatCompletion(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: request.model || this.defaultModel,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      });

      const message = response.choices[0]?.message?.content;
      if (!message) {
        throw new Error("Resposta vazia da OpenAI");
      }

      return {
        success: true,
        data: {
          message,
          usage: response.usage
            ? {
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens,
              }
            : undefined,
        },
      };
    } catch (error) {
      console.error("Erro na chamada da OpenAI:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido na OpenAI",
      };
    }
  }

  async textCompletion(
    request: CompletionRequest
  ): Promise<CompletionResponse> {
    try {
      const response = await this.client.completions.create({
        model: request.model || "text-davinci-003",
        prompt: request.prompt,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      });

      const text = response.choices[0]?.text;
      if (!text) {
        throw new Error("Resposta vazia da OpenAI");
      }

      return {
        success: true,
        data: {
          text: text.trim(),
          usage: response.usage
            ? {
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens,
              }
            : undefined,
        },
      };
    } catch (error) {
      console.error("Erro na chamada da OpenAI:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido na OpenAI",
      };
    }
  }

  async generateImage(
    prompt: string,
    size: "256x256" | "512x512" | "1024x1024" = "1024x1024"
  ) {
    try {
      const response = await this.client.images.generate({
        model: "dall-e-3",
        prompt,
        size,
        n: 1,
      });

      return {
        success: true,
        data: {
          url: response.data?.[0]?.url,
        },
      };
    } catch (error) {
      console.error("Erro na geração de imagem:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido na geração de imagem",
      };
    }
  }

  async sugestaoOrcamentoIA(
    dados: SugestaoOrcamentoRequest
  ): Promise<SugestaoOrcamentoResponse> {
    try {
      const prompt = `Analise o valor por m² deste projeto e forneça uma sugestão objetiva e direta.

Dados do projeto:
- Tipo: ${dados.tipoProjeto}
- Estado: ${dados.estado}
- Área: ${dados.metragem}m²
- Valor atual: R$${dados.valorInformado}/m²
- CUB do estado: R$${dados.cubAtual}/m²
- Margem desejada: ${dados.margem}%

Responda de forma direta, calculando:
1. A diferença percentual entre o valor atual e o CUB
2. O valor ideal por m² para manter a margem desejada
3. Uma recomendação curta

Use este formato como base:
"Seu valor de R$ [valor_atual]/m² está [X]% [acima/abaixo] do CUB de [estado] (R$ [cub]/m²). Para manter sua margem de [X]%, o ideal seria cobrar ao menos R$ [valor_sugerido]/m². [recomendação curta]"`;

      const response = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em análise de custos na construção civil. Seja direto e objetivo em suas respostas, focando em valores e percentuais.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      const sugestao = response.choices[0]?.message?.content;
      if (!sugestao) {
        throw new Error("Resposta vazia da OpenAI");
      }

      // Salvar no histórico do Supabase
      if (dados.userId) {
        const messageHistory: CreateAIMessageHistory = {
          user_id: dados.userId,
          tipo_projeto: dados.tipoProjeto,
          estado: dados.estado,
          metragem: dados.metragem,
          valor_informado: dados.valorInformado,
          margem: dados.margem,
          cub_atual: dados.cubAtual,
          sugestao: sugestao.trim(),
        };

        await supabaseService.saveAIMessage(messageHistory);
      }

      return {
        success: true,
        sugestao: sugestao.trim(),
      };
    } catch (error) {
      console.error("Erro na sugestão de orçamento IA:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro desconhecido na IA",
      };
    }
  }
}

export default new OpenAIService();
