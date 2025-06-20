import { createClient } from "@supabase/supabase-js";
import { AIMessageHistory, CreateAIMessageHistory } from "../types";

class SupabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Credenciais do Supabase não configuradas");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async saveAIMessage(
    message: CreateAIMessageHistory
  ): Promise<AIMessageHistory | null> {
    try {
      const { data, error } = await this.supabase
        .from("ai_messages_history")
        .insert([message])
        .select()
        .single();

      if (error) throw error;

      // Após salvar, vamos manter apenas as 10 mensagens mais recentes para este cliente
      await this.cleanupOldMessages(message.user_id);

      return data;
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
      return null;
    }
  }

  private async cleanupOldMessages(userId: string) {
    try {
      // Primeiro, pegamos todas as mensagens do usuário ordenadas por data
      const { data: messages } = await this.supabase
        .from("ai_messages_history")
        .select("id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!messages || messages.length <= 10) return;

      // Se houver mais de 10 mensagens, pegamos os IDs das mensagens excedentes
      const messageIdsToDelete = messages
        .slice(10)
        .map((message) => message.id);

      // Deletamos as mensagens antigas
      if (messageIdsToDelete.length > 0) {
        await this.supabase
          .from("ai_messages_history")
          .delete()
          .in("id", messageIdsToDelete);
      }
    } catch (error) {
      console.error("Erro ao limpar mensagens antigas:", error);
    }
  }

  async getUserMessages(userId: string): Promise<AIMessageHistory[]> {
    try {
      const { data, error } = await this.supabase
        .from("ai_messages_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      return [];
    }
  }
}

export default new SupabaseService();
