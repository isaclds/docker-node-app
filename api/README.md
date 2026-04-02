# API de Usuários e Posts

API em Node.js/Express para gerenciamento de usuários e posts, com autenticação via API Key e banco de dados PostgreSQL.

## 🔍 Visão Geral

Esta API permite operações CRUD para usuários e posts, com os seguintes recursos:

- **Usuários**: Criação, listagem e consulta individual
- **Posts**: Criação, listagem geral, consulta individual
- **Autenticação**: Validação de API Key em todas as rotas
- **Persistência**: PostgreSQL com Sequelize ORM

> ⚠️ **Observação Importante:** Todas as requisições (exceto `/health`) requerem autenticação via header `x-api-key`.

## 📁 Estrutura do Projeto

```bash
├── server.js              # Entry point da aplicação
├── .env                   # Variáveis de ambiente
└── src/
    ├── app.js             # Configuração principal da aplicação
    ├── controllers/       # Controllers (usersController, postsController)
    ├── routes/            # Rotas da aplicação (index, usersRoutes, postsRoutes)
    ├── services/          # Lógica de negócio (usersService, postsService)
    ├── repositories/      # Camada de acesso a dados (BaseRepository, UserRepository, PostRepository)
    ├── models/            # Modelos Sequelize (index, Users, Posts)
    ├── infra/             # Infraestrutura (database.js)
    ├── utils/             # Utilitários (logger, criarResposta, checkBody)
    └── errors/            # Classe de erro personalizada (AppError)
```

---

## 🔗 Endpoints

| Método | Rota         | Descrição                              |
| ------ | ------------ | -------------------------------------- |
| GET    | `/health`    | Health check (não requer autenticação) |
| POST   | `/users`     | Criar um novo usuário                  |
| GET    | `/users`     | Listar todos os usuários               |
| GET    | `/users/:id` | Buscar um usuário por ID               |
| POST   | `/posts`     | Criar um novo post                     |
| GET    | `/posts`     | Listar todos os posts (com autor)      |
| GET    | `/posts/:id` | Buscar um post por ID (com autor)      |

> **Base URL:** `http://localhost:[PORTA]` (configurado via `APP_PORT`)

---

## 🔐 Autenticação

Todas as requisições (exceto `/health`) devem incluir o header `x-api-key` com um token válido configurado no ambiente.

```http
x-api-key: seu_token_aqui
```

### Resposta de erro de autenticação (401)

```json
{
  "success": false,
  "title": "Usuário não autenticado",
  "detail": "x-api-key está errada ou não existe",
  "status": 401
}
```

---

## 📦 Endpoints - Usuários

### POST `/users` - Criar usuário

**Request Body:**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Descrição                        |
| ---------- | ------ | ----------- | -------------------------------- |
| `name`     | string | ✅ Sim      | Nome completo do usuário         |
| `email`    | string | ✅ Sim      | E-mail único do usuário          |
| `password` | string | ✅ Sim      | Senha (será hasheada com bcrypt) |

**Resposta de sucesso (201):**

```json
{
  "success": true,
  "title": "User created successfully",
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "status": 201
}
```

> ⚠️ O campo `password` NÃO é retornado na resposta.

### GET `/users` - Listar todos os usuários

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "title": "All Users retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "status": 200
}
```

### GET `/users/:id` - Buscar usuário por ID

**Parâmetros de rota:**

| Parâmetro | Tipo   | Descrição       |
| --------- | ------ | --------------- |
| `id`      | string | UUID do usuário |

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "title": "User retrieved successfully.",
  "detail": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "status": 200
}
```

---

## 📦 Endpoints - Posts

### POST `/posts` - Criar post

**Request Body:**

```json
{
  "email": "joao@email.com",
  "title": "Meu primeiro post",
  "content": "Conteúdo do post aqui..."
}
```

| Campo     | Tipo   | Obrigatório | Descrição                                 |
| --------- | ------ | ----------- | ----------------------------------------- |
| `email`   | string | ✅ Sim      | E-mail do autor (deve existir no sistema) |
| `title`   | string | ✅ Sim      | Título do post                            |
| `content` | string | ✅ Sim      | Conteúdo do post                          |

**Resposta de sucesso (201):**

```json
{
  "success": true,
  "title": "Post created successfully.",
  "detail": {
    "id": "uuid",
    "title": "Meu primeiro post",
    "content": "Conteúdo do post aqui...",
    "userId": "uuid_do_autor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "status": 201
}
```

### GET `/posts` - Listar todos os posts (com autor)

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "title": "All posts retrieved successfully.",
  "data": [
    {
      "id": "uuid",
      "title": "Meu primeiro post",
      "content": "Conteúdo do post...",
      "userId": "uuid_do_autor",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "email": "joao@email.com"
      }
    }
  ],
  "status": 200
}
```

### GET `/posts/:id` - Buscar post por ID (com autor)

**Parâmetros de rota:**

| Parâmetro | Tipo   | Descrição    |
| --------- | ------ | ------------ |
| `id`      | string | UUID do post |

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "title": "Post retrieved successfully.",
  "detail": {
    "id": "uuid",
    "title": "Meu primeiro post",
    "content": "Conteúdo do post...",
    "userId": "uuid_do_autor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "email": "joao@email.com"
    }
  },
  "status": 200
}
```

---

## ✅ Resposta Padrão

Todas as respostas seguem o formato:

```json
{
  "success": boolean,
  "title": string,
  "detail": object | string | null,
  "status": number
}
```

| Campo     | Tipo          | Descrição                             |
| --------- | ------------- | ------------------------------------- |
| `success` | boolean       | Indica se a operação foi bem-sucedida |
| `title`   | string        | Título do resultado da requisição     |
| `detail`  | object/string | Dados retornados ou mensagem de erro  |
| `status`  | number        | Status HTTP da requisição             |

---

## ❌ Resposta de Erro

```json
{
  "success": false,
  "title": "Missing required fields",
  "detail": "Missing fields or values: email, title",
  "status": 400
}
```

### Possíveis erros

| Status | Título                     | Descrição                              |
| ------ | -------------------------- | -------------------------------------- |
| 401    | Usuário não autenticado    | Header `x-api-key` ausente ou inválido |
| 400    | Missing required fields    | Campos obrigatórios faltando no body   |
| 400    | Request body is missing    | Body da requisição ausente             |
| 400    | Failed to create user/post | Falha na criação do registro           |
| 404    | No post/user was found     | ID fornecido não encontrado            |
| 409    | Duplicate entry            | E-mail já existe no sistema            |
| 400    | Validation error           | Erro de validação do Sequelize         |
| 500    | Internal server error      | Erro interno não tratado               |

---

## 📊 Logs

Os logs são gerenciados pelo Winston com as seguintes características:

- **Console**: Exibe logs no terminal
- **Arquivo**: Salva logs no arquivo configurado por `LOG_FILENAME`
- **Rotação automática**:
  - Limite de 20MB por arquivo
  - Mantém até 5 arquivos de backup

Formato do log:

```
dd/mm/aaaa HH:MM:SS [level]: [mensagem]
```

### Níveis de log

Configurável via variável `LOG_LEVEL` (ex: `info`, `debug`, `error`)

---

## ⚙️ Configuração

Variáveis necessárias no arquivo `.env`:

```env
# Servidor
APP_PORT=3000

# Autenticação
APP_KEY=seu_token_aqui

# Banco de dados PostgreSQL
POSTGRES_DB=nome_do_banco
POSTGRES_USER=usuario
POSTGRES_PASSWORD=senha
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Logs
LOG_LEVEL=info
LOG_FILENAME=./logs/app.log
```

---

## 🚀 Execução

### Produção

```bash
npm start
# ou
node server.js
```

### Desenvolvimento

```bash
npm run dev
```

---

## 📝 Exemplos de Uso

### Health Check

```bash
curl http://localhost:3000/health
```

### Criar usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: seu_token" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Listar usuários

```bash
curl -X GET http://localhost:3000/users \
  -H "x-api-key: seu_token"
```

### Criar post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: seu_token" \
  -d '{
    "email": "joao@email.com",
    "title": "Título do post",
    "content": "Conteúdo do post..."
  }'
```

### Listar posts

```bash
curl -X GET http://localhost:3000/posts \
  -H "x-api-key: seu_token"
```

---

## 🔍 Relacionamentos

- **Users** → **Posts**: Um usuário pode ter muitos posts
- **Posts** → **Users**: Um post pertence a um usuário (autor)

### Estrutura das tabelas

#### Tabela `users`

| Campo      | Tipo      | Descrição                    |
| ---------- | --------- | ---------------------------- |
| id         | UUID      | Chave primária (auto-gerada) |
| name       | STRING    | Nome do usuário              |
| email      | STRING    | E-mail único                 |
| password   | STRING    | Senha hasheada               |
| is_active  | BOOLEAN   | Status do usuário            |
| created_at | TIMESTAMP | Data de criação              |
| updated_at | TIMESTAMP | Data de atualização          |

#### Tabela `posts`

| Campo      | Tipo      | Descrição                    |
| ---------- | --------- | ---------------------------- |
| id         | UUID      | Chave primária (auto-gerada) |
| title      | STRING    | Título do post               |
| content    | TEXT      | Conteúdo do post             |
| user_id    | UUID      | Chave estrangeira (Users.id) |
| created_at | TIMESTAMP | Data de criação              |
| updated_at | TIMESTAMP | Data de atualização          |

---

## 🔧 Hooks e Segurança

### Hash de senha

As senhas são automaticamente hasheadas com bcrypt (10 rounds) antes de serem salvas no banco:

- `beforeCreate`: Hash na criação do usuário
- `beforeUpdate`: Hash apenas se o campo `password` foi alterado

### Exclusão de senha nas respostas

O modelo `Users` possui um `defaultScope` que exclui automaticamente o campo `password` de todas as consultas.

---

## 🔍 Troubleshooting

### Erro: "Unable to connect to the data base!"

**Causa:** Falha na conexão com o PostgreSQL  
**Solução:**

- Verifique se o banco está rodando
- Confira as variáveis de ambiente do banco
- Teste a conectividade com o host configurado

### Erro: "Usuário não autenticado"

**Causa:** Header `x-api-key` ausente ou inválido  
**Solução:**

- Verifique se o header está sendo enviado
- Compare com o valor configurado em `APP_KEY` no `.env`

### Erro: "Missing required fields"

**Causa:** Campos obrigatórios ausentes no body  
**Solução:**

- Verifique a documentação dos campos esperados
- Certifique-se de que os valores não estão vazios

### Erro: "Duplicate entry"

**Causa:** Tentativa de criar usuário com e-mail já existente  
**Solução:**

- Utilize um e-mail diferente
- Verifique se o usuário já está cadastrado

---

Para debug detalhado, consulte os logs no arquivo configurado por `LOG_FILENAME`.
