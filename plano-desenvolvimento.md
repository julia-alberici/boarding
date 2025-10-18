# **Documento de Arquitetura e Escopo - Sistema de Gerenciamento de Tarefas**

## **1. Sumário Executivo**

### 1.1 Visão Geral
Desenvolvimento de uma aplicação web de gerenciamento de tarefas inspirada em ferramentas consolidadas como ClickUp e Trello, com foco em entrega rápida, funcionalidades essenciais e código limpo utilizando Express.js.

### 1.2 Objetivos Principais
- Entregar um MVP funcional com as features core em 5 dias
- Demonstrar proficiência em TypeScript/React/Express.js
- Implementar arquitetura simples e eficiente
- Priorizar funcionalidades de maior impacto

### 1.3 Stakeholders
- **Avaliadores Técnicos**: Foco em qualidade de código e decisões pragmáticas
- **Usuários Finais**: Interface funcional e intuitiva

## **2. Análise de Requisitos e Priorização**

### 2.1 Matriz de Priorização (MoSCoW) - Ajustada para 5 dias

| Categoria | Funcionalidade | Justificativa | Esforço | Valor | Dia |
|-----------|---------------|---------------|---------|-------|-----|
| **MUST HAVE** | Autenticação JWT | Fundamento de segurança | Médio | Alto | 1 |
| **MUST HAVE** | CRUD de Boards | Core do produto | Baixo | Alto | 2 |
| **MUST HAVE** | CRUD de Tarefas | Core do produto | Médio | Alto | 2-3 |
| **MUST HAVE** | Estados de Tarefas | Requisito funcional básico | Baixo | Alto | 3 |
| **MUST HAVE** | Interface Responsiva | Requisito explícito | Médio | Alto | 1-5 |
| **SHOULD HAVE** | Drag & Drop de Cards | Diferencial UX | Alto | Alto | 4 |
| **SHOULD HAVE** | Prioridades (Low/Med/High) | Organização básica | Baixo | Médio | 3 |
| **SHOULD HAVE** | Filtros por Status | Melhora usabilidade | Baixo | Médio | 4 |
| **COULD HAVE** | Busca de Tarefas | Feature esperada | Baixo | Médio | 5 |
| **COULD HAVE** | Testes Unitários Core | Qualidade código | Médio | Alto | 5 |
| **WON'T HAVE** | Compartilhamento de Boards | Complexidade vs. Tempo | Alto | Médio | - |
| **WON'T HAVE** | Permissões Granulares | Fora do escopo 5 dias | Alto | Baixo | - |

### 2.2 Decisões de Escopo

**Incluído no MVP (5 dias):**
- Sistema de autenticação simples com JWT
- CRUD completo de boards e tarefas
- Sistema de status (colunas) para tarefas
- Prioridades nas tarefas
- Interface responsiva
- Drag & drop
- Filtros básicos

**Excluído do MVP (com justificativa):**
- Compartilhamento/Colaboração: Adiciona complexidade significativa de backend e estado
- WebSockets: Desnecessário para MVP
- Upload de arquivos: Infraestrutura adicional
- Testes E2E: Foco em entregar funcionalidades

## **3. Arquitetura Técnica**

### 3.1 Stack Tecnológico

#### **Backend**
```
├── Runtime: Node.js 20 LTS
├── Framework: Express.js
├── ORM: Prisma
├── Database: PostgreSQL
├── Auth: jsonwebtoken + bcrypt
├── Validation: express-validator
├── Middleware: cors, helmet, express-rate-limit
└── Testing: Jest (depende de tempo)
```

#### **Frontend**
```
├── Framework: React 18 + TypeScript
├── Build Tool: Vite
├── Routing: React Router v6
├── Estado: Zustand
├── UI Framework: Tailwind CSS + Headless UI
├── Drag & Drop: hello-pangea-dnd
├── Forms: Controlled components simples
├── HTTP Client: Axios com interceptors
└── Deploy: Vercel/Netlify (rápido e grátis)
```

### 3.2 Arquitetura de Sistema Simplificada

```
┌─────────────────┐
│   React SPA     │
│   (Vercel)      │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐
│  Express API    │
│   (Railway)     │
└────────┬────────┘
         │
┌────────▼────────┐
│    SQLite/      │
│   PostgreSQL    │
└─────────────────┘
```

### 3.3 Estrutura de Pastas

#### **Backend**
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── auth.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── board.routes.ts
│   │   └── task.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── board.controller.ts
│   │   └── task.controller.ts
│   ├── services/
│   │   ├── auth'.service.ts
│   │   ├── board.service.ts
│   │   └── task.service.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── .env.example
└── server.ts
```

#### **Frontend**
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Board/
│   │   ├── Task/
│   │   └── UI/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── BoardView.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── store/
│   │   └── index.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
└── index.html
```

### 3.4 Modelo de Dados

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  boards    Board[]
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Board {
  id          String   @id @default(uuid())
  title       String
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  lists       List[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model List {
  id       String  @id @default(uuid())
  title    String
  position Int
  boardId  String
  board    Board   @relation(fields: [boardId], references: [id], onDelete: Cascade)
  tasks    Task[]
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  position    Int
  listId      String
  list        List      @relation(fields: [listId], references: [id], onDelete: Cascade)
  assignedId  String?
  assignedTo  User?     @relation(fields: [assignedId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## **4. Especificações Funcionais**

### 4.1 APIs Essenciais

#### **Autenticação**
```typescript
POST   /api/auth/register  // Registro de usuário
POST   /api/auth/login     // Login (retorna JWT)
GET    /api/auth/me        // Dados do usuário atual
```

#### **Boards**
```typescript
GET    /api/boards         // Listar boards do usuário
POST   /api/boards         // Criar board
PUT    /api/boards/:id     // Atualizar board
DELETE /api/boards/:id     // Deletar board
GET    /api/boards/:id     // Detalhes do board com listas e tasks
```

#### **Tasks**
```typescript
POST   /api/boards/:boardId/tasks      // Criar task
PUT    /api/tasks/:id                  // Atualizar task
DELETE /api/tasks/:id                  // Deletar task
PUT    /api/tasks/:id/move             // Mover task (drag & drop)
GET    /api/boards/:boardId/tasks      // Listar tasks com filtros
```

### 4.2 Fluxos de Usuário Simplificados

```
1. Registro/Login
   └── Dashboard com boards
       └── Criar/Selecionar board
           └── Ver colunas (To Do, In Progress, Done)
               └── Criar/Editar/Mover tasks
```

## **5. Plano de Implementação **

### 5.1 Checklist

- [X] Setup projeto backend Express + TypeScript
- [X] Configurar Prisma com PostgreSQL
- [X] Estrutura base de pastas e arquivos
- [X] Configurar middlewares essenciais
- [X] Implementar autenticação completa (register/login)
- [X] JWT middleware
- [X] Setup projeto React + Vite
- [X] Tela de login/registro funcional
- [X] API CRUD completa de Boards
- [X] API de Listas (criar com board)
- [X] Validações básicas
- [X] Dashboard Frontend
- [X] Listagem de boards
- [X] Criar/Editar/Deletar boards
- [X] Roteamento e navegação
- [X] API CRUD completa de Tasks
- [X] Sistema de prioridades
- [X] API de movimentação de tasks
- [X] Interface de visualização do board
- [X] Componentes de Task Card
- [X] Criar/Editar/Deletar tasks
- [X] Visual de prioridades
- [X] Implementar drag & drop (se viável)
- [ ] Fallback: botões de mover task
- [X] Atualização de posições
- [ ] Sistema de filtros por status
- [ ] UI de filtros
- [X] Responsividade mobile
- [ ] Ajustes de UX
- [ ] Implementar busca simples
- [ ] Loading states e error handling
- [ ] Otimizações de performance
- [ ] Testes manuais completos
- [ ] Correção de bugs
- [X] Documentação README
- [ ] Preparar para deploy
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configurar variáveis de ambiente
- [ ] Testes em produção

### 5.2 Definição de "Done"

Uma funcionalidade está pronta quando:
- ✅ Funciona conforme esperado
- ✅ Não quebra outras funcionalidades
- ✅ Responsiva em mobile e desktop
- ✅ Tratamento básico de erros

## **6. Riscos e Mitigações (5 Dias)**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Drag & Drop complexo | Alta | Médio | Ter fallback com botões |
| Bugs de última hora | Alta | Alto | Reservar dia 5 para fixes |
| Setup demorado | Baixa | Alto | Usar boilerplates prontos |
| Performance ruim | Média | Médio | Otimizar apenas se necessário |

## **7. Decisões de Trade-off**

### 7.1 Qualidade vs. Velocidade
**Decisão:** Código funcional com refatoração posterior
**Justificativa:** 5 dias exigem foco em entrega

### 7.2 Testes vs. Features
**Decisão:** Apenas testes manuais, zero automação
**Justificativa:** Cada hora em testes = uma feature a menos

### 7.3 UX Polida vs. Funcional
**Decisão:** Interface funcional com Tailwind
**Justificativa:** Tailwind garante visual decente sem esforço

## **8. Checklist de Entrega**

### Funcionalidades Core
- [X] Usuário consegue se registrar e fazer login
- [X] Usuário consegue criar/editar/deletar boards
- [X] Usuário consegue criar/editar/deletar tasks
- [X] Tasks têm status (através de listas/colunas)
- [X] Tasks têm prioridade visual
- [X] Interface é responsiva

### Funcionalidades Bônus (se der tempo)
- [X] Drag & drop funcional
- [ ] Filtros funcionando
- [ ] Busca implementada
- [ ] Deploy realizado

### Documentação Mínima
- [X] README com instruções de setup
- [X] .env.example configurado
- [ ] Credenciais de teste
