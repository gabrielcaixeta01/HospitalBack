# HospCare API — Back-end

API REST do sistema de gestão hospitalar HospCare, desenvolvida com NestJS, Prisma ORM e PostgreSQL.


## Funcionalidades

### Médicos e Especialidades
- Cadastro e gerenciamento
- Associação entre médico e especialidade

### Pacientes
- CRUD completo
- Upload de arquivos clínicos

### Consultas
- Agendamentos
- Notas médicas

### Leitos
- Cadastro e status
- Controle automático via internações

### Internações
- Admissão
- Alta hospitalar
- Atualização automática do leito

### Exames
- Pedido de exame vinculado à consulta
- Resultados pendentes ou concluídos

## Configuração do Ambiente

### Arquivo `.env`

Crie um arquivo `.env` com:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/hospital"
PORT=4000
```

### Instalar dependências

```
npm install
```

### Gerar client Prisma

```
npx prisma generate
```

### Rodar migrações

```
npx prisma migrate dev
```

### Iniciar o servidor

```
npm run start:dev
```

A API ficará disponível em:

```
http://localhost:4000/api/v1
```

## Prisma Studio

```
npx prisma studio
```

## Endpoints Principais

### Pacientes
| Método | Rota |
|--------|------|
| GET | /pacientes |
| POST | /pacientes |
| GET | /pacientes/:id |
| PATCH | /pacientes/:id |
| DELETE | /pacientes/:id |

### Médicos
| Método | Rota |
|--------|------|
| GET | /medicos |
| POST | /medicos |
| GET | /medicos/:id |
| PATCH | /medicos/:id |
| DELETE | /medicos/:id |
| POST | /medicos/:id/especialidades |

### Especialidades
| Método | Rota |
|--------|------|
| GET | /especialidades |
| POST | /especialidades |

### Consultas
| Método | Rota |
|--------|------|
| GET | /consultas |
| POST | /consultas |
| GET | /consultas/:id |
| PATCH | /consultas/:id |

### Leitos
| Método | Rota |
|--------|------|
| GET | /leitos |
| POST | /leitos |
| PATCH | /leitos/:id |
| PATCH | /leitos/:id/status |

### Internações
| Método | Rota |
|--------|------|
| GET | /internacoes |
| POST | /internacoes |
| PATCH | /internacoes/:id/alta |

### Exames
| Método | Rota |
|--------|------|
| GET | /exames |
| POST | /exames |
| GET | /exames/:id |
