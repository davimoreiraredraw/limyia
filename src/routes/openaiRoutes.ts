import { Router } from "express";
import openaiController from "../controllers/openaiController";
import express from "express";
import openaiService from "../services/openaiService";
import supabaseService from "../services/supabaseService";
import { ApiError } from "../types";

const router = Router();

/**
 * @swagger
 * /api/openai/health:
 *   get:
 *     summary: Verifica o status da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API está funcionando corretamente
 *                 timestamp:
 *                   type: string
 *                   example: "2024-02-20T10:00:00Z"
 */
router.get("/health", openaiController.healthCheck);

/**
 * @swagger
 * /api/openai/sugestao-orcamento:
 *   post:
 *     summary: Gera sugestão inteligente para orçamento
 *     tags: [Orçamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SugestaoOrcamentoRequest'
 *     responses:
 *       200:
 *         description: Sugestão gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SugestaoOrcamentoResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/sugestao-orcamento", openaiController.sugestaoOrcamentoIA);

/**
 * @swagger
 * /api/openai/chat:
 *   post:
 *     summary: Realiza uma conversa com a OpenAI
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Resposta gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/chat", openaiController.chatCompletion);

/**
 * @swagger
 * /api/openai/completion:
 *   post:
 *     summary: Gera um texto baseado em um prompt
 *     tags: [Completion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Escreva uma história sobre um gato"
 *               model:
 *                 type: string
 *                 example: "text-davinci-003"
 *               temperature:
 *                 type: number
 *                 example: 0.7
 *               max_tokens:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Texto gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Era uma vez um gato..."
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/completion", openaiController.textCompletion);

/**
 * @swagger
 * /api/openai/image:
 *   post:
 *     summary: Gera uma imagem baseada em um prompt
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Um gato sentado em um jardim ensolarado"
 *               size:
 *                 type: string
 *                 enum: ["256x256", "512x512", "1024x1024"]
 *                 default: "1024x1024"
 *     responses:
 *       200:
 *         description: Imagem gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://..."
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/image", openaiController.generateImage);

// Rota para buscar as últimas mensagens do usuário
router.get("/messages/:userId", openaiController.getUserMessages);

export default router;
