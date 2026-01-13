# Weather API – Node + Prisma + Docker

API desenvolvida para consumir dados climáticos da OpenWeather, salvar em banco PostgreSQL e disponibilizar consultas através de endpoints REST.

Projeto criado como parte de uma avaliação técnica, focando em fundamentos, organização e boas práticas.

---

## Sobre o projeto

A aplicação:

- Consome uma API pública (OpenWeather)
- Armazena os dados em banco relacional
- Disponibiliza endpoints para consulta
- Utiliza Docker para garantir ambiente reproduzível
- Possui documentação via Swagger

---

## Funcionalidades

- Health check da API
- Busca de clima por cidade
- Persistência dos dados no banco
- Consulta de histórico
- Retorno do último registro por cidade
- Documentação automática dos endpoints

---

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Docker / Docker Compose
- Swagger

---

## Estrutura do projeto

project-root/
│
├── prisma/
│ ├── migrations/
│ └── schema.prisma
│
├── src/
│ ├── config.ts
│ ├── db.ts
│ ├── openweather.ts
│ ├── swagger.ts
│ ├── startup.ts
│ └── index.ts
│
├── Dockerfile
├── docker-compose.yml
├── .env.docker.example
├── .env.example
├── .gitignore
├── .dockerignore
├── tsconfig.json
├── package.json
└── README.md

---

## Como rodar o projeto

### Pré-requisitos

- Docker instalado
- Docker Compose ativo

---

### 1. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

**PowerShell / CMD (Windows)**

```
copy .env.docker.example .env.docker
```

**Git Bash / Linux / Mac**

```
cp .env.docker.example .env.docker
```

Depois edite o arquivo .env.docker e informe sua API Key:
OPENWEATHER_API_KEY=SUA_API_KEY_AQUI

Você pode gerar a API key em:
https://openweathermap.org/api

### 2. Subir a aplicação

docker compose up -d --build

### 3. Aplicar migrations do banco

docker compose exec api npx prisma migrate deploy

Isso garante que o banco seja criado corretamente mesmo em um ambiente novo.

Endpoints disponíveis
Método Rota Descrição
GET, /health, Verifica se API e banco estão ativos
GET, /fetch?city=Itajai, Busca clima e salva no banco
GET, /weather, Lista registros salvos
GET, /weather/latest?city=Itajai, Último registro da cidade
GET, /docs, Documentação Swagger

### Documentação

Acesse no navegador: http://localhost:8000/docs

---

## Decisões técnicas

- Prisma para controle de migrations e segurança na camada de dados
- Docker para garantir ambiente reproduzível
- TypeScript para melhor controle de tipagem
- Estrutura criada manualmente (sem boilerplates) para demonstrar fundamentos
- Validação de variáveis de ambiente com Zod

---

## Segurança

- Variáveis sensíveis ficam fora do código (.env)
- API Key não é versionada
- Validação de ambiente na inicialização da aplicação

---

## Considerações finais

Projeto desenvolvido para demonstrar:

- Integração com API externa
- Persistência em banco relacional
- Containerização
- Organização de código
- Documentação técnica
