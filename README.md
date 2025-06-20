# Limyia - API de Integração com OpenAI

Uma API Node.js/TypeScript para integração com a OpenAI, permitindo chat, completions de texto e geração de imagens.

## 🚀 Tecnologias

- **Node.js 20** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express.js** - Framework web
- **OpenAI** - Integração com IA
- **pnpm** - Gerenciador de pacotes

## 📋 Pré-requisitos

- Node.js 20+
- pnpm
- Chave de API da OpenAI

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd limyia
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione sua chave da OpenAI:

```env
OPENAI_API_KEY=sua_chave_da_openai_aqui
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

```bash
pnpm dev
```

### Produção

```bash
pnpm build
pnpm start
```

## 📚 Endpoints da API

### Health Check

```http
GET /api/openai/health
```

### Chat Completion

```http
POST /api/openai/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "system",
      "content": "Você é um assistente útil."
    },
    {
      "role": "user",
      "content": "Olá, como você está?"
    }
  ],
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

### Text Completion

```http
POST /api/openai/completion
Content-Type: application/json

{
  "prompt": "Escreva uma história sobre um gato",
  "model": "text-davinci-003",
  "temperature": 0.7,
  "max_tokens": 500
}
```

### Image Generation

```http
POST /api/openai/image
Content-Type: application/json

{
  "prompt": "Um gato sentado em um jardim ensolarado",
  "size": "1024x1024"
}
```

## 🔧 Configurações

### Variáveis de Ambiente

| Variável         | Descrição                  | Padrão                  |
| ---------------- | -------------------------- | ----------------------- |
| `PORT`           | Porta do servidor          | `3000`                  |
| `NODE_ENV`       | Ambiente de execução       | `development`           |
| `OPENAI_API_KEY` | Chave da API OpenAI        | -                       |
| `OPENAI_MODEL`   | Modelo padrão da OpenAI    | `gpt-3.5-turbo`         |
| `CORS_ORIGIN`    | Origem permitida para CORS | `http://localhost:3000` |

## 📁 Estrutura do Projeto

```
src/
├── controllers/     # Controladores da API
├── middleware/      # Middlewares personalizados
├── routes/          # Definição de rotas
├── services/        # Serviços de negócio
├── types/           # Tipos TypeScript
└── index.ts         # Arquivo principal
```

## 🧪 Testando a API

### Exemplo com curl

1. **Health Check:**

```bash
curl http://localhost:3000/api/openai/health
```

2. **Chat Completion:**

```bash
curl -X POST http://localhost:3000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Olá, como você está?"}
    ]
  }'
```

3. **Text Completion:**

```bash
curl -X POST http://localhost:3000/api/openai/completion \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escreva uma história curta sobre um gato"
  }'
```

4. **Image Generation:**

```bash
curl -X POST http://localhost:3000/api/openai/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Um gato fofo dormindo"
  }'
```

## 🔒 Segurança

- **Helmet.js** para headers de segurança
- **CORS** configurado
- **Rate limiting** (pode ser adicionado)
- **Validação de entrada** nos endpoints

## 📝 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
