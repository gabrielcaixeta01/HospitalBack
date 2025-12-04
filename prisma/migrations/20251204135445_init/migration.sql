-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('M', 'F', 'O');

-- CreateTable
CREATE TABLE "consulta" (
    "id" BIGSERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "motivo" VARCHAR(255),
    "notas" TEXT,
    "medicoId" BIGINT NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "especialidadeId" BIGINT NOT NULL,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidade" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(80) NOT NULL,

    CONSTRAINT "especialidade_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "internacao" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "leitoId" BIGINT NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL,
    "dataAlta" TIMESTAMP(3),

    CONSTRAINT "internacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leito" (
    "id" BIGSERIAL NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "status" VARCHAR(40) NOT NULL,

    CONSTRAINT "leito_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "prescricao" (
    "id" BIGSERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "consultaId" BIGINT NOT NULL,

    CONSTRAINT "prescricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivo_clinico" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "nome_arquivo" VARCHAR(180) NOT NULL,
    "mime_type" VARCHAR(80) NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivo_clinico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EspecialidadeToMedico" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_EspecialidadeToMedico_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "consulta_medicoId_idx" ON "consulta"("medicoId");

CREATE INDEX "consulta_pacienteId_idx" ON "consulta"("pacienteId");

CREATE INDEX "consulta_especialidadeId_idx" ON "consulta"("especialidadeId");

CREATE UNIQUE INDEX "especialidade_nome_key" ON "especialidade"("nome");

CREATE INDEX "exame_consultaId_idx" ON "exame"("consultaId");

CREATE INDEX "internacao_leitoId_idx" ON "internacao"("leitoId");

CREATE INDEX "internacao_pacienteId_idx" ON "internacao"("pacienteId");

CREATE UNIQUE INDEX "leito_codigo_key" ON "leito"("codigo");

CREATE UNIQUE INDEX "medico_crm_key" ON "medico"("crm");

CREATE UNIQUE INDEX "paciente_cpf_key" ON "paciente"("cpf");

CREATE INDEX "prescricao_consultaId_idx" ON "prescricao"("consultaId");

CREATE INDEX "arquivo_clinico_pacienteId_idx" ON "arquivo_clinico"("pacienteId");

CREATE INDEX "_EspecialidadeToMedico_B_index" ON "_EspecialidadeToMedico"("B");

ALTER TABLE "consulta" ADD CONSTRAINT "consulta_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "consulta" ADD CONSTRAINT "consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "consulta" ADD CONSTRAINT "consulta_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "exame" ADD CONSTRAINT "exame_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "internacao" ADD CONSTRAINT "internacao_leitoId_fkey" FOREIGN KEY ("leitoId") REFERENCES "leito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "internacao" ADD CONSTRAINT "internacao_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "prescricao" ADD CONSTRAINT "prescricao_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "arquivo_clinico" ADD CONSTRAINT "arquivo_clinico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_EspecialidadeToMedico" ADD CONSTRAINT "_EspecialidadeToMedico_A_fkey" FOREIGN KEY ("A") REFERENCES "especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_EspecialidadeToMedico" ADD CONSTRAINT "_EspecialidadeToMedico_B_fkey" FOREIGN KEY ("B") REFERENCES "medico"("id") ON DELETE CASCADE ON UPDATE CASCADE;




CREATE OR REPLACE VIEW internacoes_ativas_detalhes AS
SELECT
    I.id            AS internacao_id,
    I."leitoId"     AS "leitoId",   
    P.nome          AS nome_paciente,
    P.cpf           AS cpf_paciente,
    L.codigo        AS codigo_leito,
    L.status        AS status_leito,
    I."dataEntrada" AS data_entrada,
    M.nome          AS medico_da_ultima_consulta
FROM "internacao" I
JOIN "paciente" P ON I."pacienteId" = P.id
JOIN "leito"    L ON I."leitoId"    = L.id
LEFT JOIN LATERAL (
    SELECT M2.nome
    FROM "consulta" C2
    JOIN "medico"  M2 ON C2."medicoId" = M2.id
    WHERE C2."pacienteId" = P.id
      AND C2."dataHora"   < I."dataEntrada"
    ORDER BY C2."dataHora" DESC
    LIMIT 1
) AS M ON TRUE
WHERE I."dataAlta" IS NULL;




CREATE OR REPLACE FUNCTION atualizar_status_leito_internacao()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE "leito"
        SET status = 'ocupado'
        WHERE id = NEW."leitoId";
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF OLD."dataAlta" IS NULL AND NEW."dataAlta" IS NOT NULL THEN
            IF NOT EXISTS (
                SELECT 1 FROM "internacao"
                WHERE "leitoId" = NEW."leitoId"
                  AND "dataAlta" IS NULL
                  AND id <> NEW.id
            ) THEN
                UPDATE "leito"
                SET status = 'livre'
                WHERE id = NEW."leitoId";
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_atualiza_status_leito
AFTER INSERT OR UPDATE ON "internacao"
FOR EACH ROW
EXECUTE FUNCTION atualizar_status_leito_internacao();




CREATE OR REPLACE FUNCTION validar_medico_especialidade(
    p_medico_id BIGINT,
    p_especialidade_id BIGINT
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "_EspecialidadeToMedico" em
        WHERE em."A" = p_especialidade_id  
          AND em."B" = p_medico_id       
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE criar_consulta_validada(
    p_paciente_id      BIGINT,
    p_medico_id        BIGINT,
    p_especialidade_id BIGINT,
    p_data_hora        TIMESTAMP,
    p_motivo           VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT validar_medico_especialidade(p_medico_id, p_especialidade_id) THEN
        RAISE EXCEPTION 
            'O médico % não possui a especialidade %', 
            p_medico_id, p_especialidade_id;
    END IF;

    INSERT INTO "consulta" (
        "pacienteId",
        "medicoId",
        "especialidadeId",
        "dataHora",
        "motivo"
    )
    VALUES (
        p_paciente_id,
        p_medico_id,
        p_especialidade_id,
        p_data_hora,
        p_motivo
    );
END;
$$;


CREATE OR REPLACE FUNCTION checar_consulta_especialidade_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validar_medico_especialidade(NEW."medicoId", NEW."especialidadeId") THEN
        RAISE EXCEPTION 
            'O médico % não possui a especialidade %', 
            NEW."medicoId", NEW."especialidadeId";
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_consulta_especialidade
BEFORE INSERT OR UPDATE ON "consulta"
FOR EACH ROW
EXECUTE FUNCTION checar_consulta_especialidade_trigger();