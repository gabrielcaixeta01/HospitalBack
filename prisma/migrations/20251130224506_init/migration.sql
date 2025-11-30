-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('M', 'F', 'O');

-- CreateTable
CREATE TABLE "paciente" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "nascimento" DATE NOT NULL,
    "sexo" "Sexo",
    "telefone" VARCHAR(40),
    "email" VARCHAR(120),
    "observacoes" TEXT,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medico" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "crm" VARCHAR(40),
    "email" VARCHAR(120),
    "telefone" VARCHAR(40),

    CONSTRAINT "medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidade" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(80) NOT NULL,

    CONSTRAINT "especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulta" (
    "id" BIGSERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "motivo" VARCHAR(255),
    "notas" TEXT,
    "medicoId" BIGINT NOT NULL,
    "pacienteId" BIGINT NOT NULL,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exame" (
    "id" BIGSERIAL NOT NULL,
    "tipo" VARCHAR(120) NOT NULL,
    "resultado" TEXT,
    "dataHora" TIMESTAMP(3),
    "consultaId" BIGINT NOT NULL,

    CONSTRAINT "exame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leito" (
    "id" BIGSERIAL NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "status" VARCHAR(40) NOT NULL,

    CONSTRAINT "leito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internacao" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "leitoId" BIGINT NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL,
    "dataAlta" TIMESTAMP(3),

    CONSTRAINT "internacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EspecialidadeToMedico" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_EspecialidadeToMedico_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "paciente_cpf_key" ON "paciente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "medico_crm_key" ON "medico"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "especialidade_nome_key" ON "especialidade"("nome");

-- CreateIndex
CREATE INDEX "consulta_medicoId_idx" ON "consulta"("medicoId");

-- CreateIndex
CREATE INDEX "consulta_pacienteId_idx" ON "consulta"("pacienteId");

-- CreateIndex
CREATE INDEX "exame_consultaId_idx" ON "exame"("consultaId");

-- CreateIndex
CREATE UNIQUE INDEX "leito_codigo_key" ON "leito"("codigo");

-- CreateIndex
CREATE INDEX "internacao_pacienteId_idx" ON "internacao"("pacienteId");

-- CreateIndex
CREATE INDEX "internacao_leitoId_idx" ON "internacao"("leitoId");

-- CreateIndex
CREATE INDEX "_EspecialidadeToMedico_B_index" ON "_EspecialidadeToMedico"("B");

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exame" ADD CONSTRAINT "exame_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacao" ADD CONSTRAINT "internacao_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacao" ADD CONSTRAINT "internacao_leitoId_fkey" FOREIGN KEY ("leitoId") REFERENCES "leito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EspecialidadeToMedico" ADD CONSTRAINT "_EspecialidadeToMedico_A_fkey" FOREIGN KEY ("A") REFERENCES "especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EspecialidadeToMedico" ADD CONSTRAINT "_EspecialidadeToMedico_B_fkey" FOREIGN KEY ("B") REFERENCES "medico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
