export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    content: string;
    tokens: number;
  };
  error?: string;
}

export interface CompletionRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface CompletionResponse {
  success: boolean;
  data?: {
    text: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface SugestaoOrcamentoRequest {
  tipoProjeto: string;
  estado: string;
  metragem: number;
  valorInformado: number;
  margem: number;
  cubAtual: number;
  userId?: string;
}

export interface SugestaoOrcamentoResponse {
  success: boolean;
  sugestao?: string;
  error?: string;
}

export interface AIMessageHistory {
  id: string;
  user_id: string;
  tipo_projeto: string;
  estado: string;
  metragem: number;
  valor_informado: number;
  margem: number;
  cub_atual: number;
  sugestao: string;
  created_at: string;
}

export interface CreateAIMessageHistory {
  user_id: string;
  tipo_projeto: string;
  estado: string;
  metragem: number;
  valor_informado: number;
  margem: number;
  cub_atual: number;
  sugestao: string;
}
