-- DDL para Criação do Esquema de Banco de Dados Hospitalar (PostgreSQL)


-- Tabela PACIENTE 
CREATE TABLE paciente (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- [cite: 137, 138, 163]
    nome        VARCHAR (120) NOT NULL, [cite: 164]
    cpf         VARCHAR (14) UNIQUE NOT NULL, -- Restrição de unicidade [cite: 148, 165]
    nascimento  DATE NOT NULL, [cite: 168]
    sexo        CHAR (1) CHECK (sexo IN ('M', 'F','O')), -- Restrição de domínio [cite: 150, 172]
    telefone    VARCHAR (40),
    email       VARCHAR (120),
    observacoes TEXT
);

-- Tabela MEDICO 
CREATE TABLE medico (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 182]
    nome        VARCHAR (120) NOT NULL, [cite: 185]
    crm         VARCHAR (40) UNIQUE, -- crm é UNIQUE, conforme requisito [cite: 148]
    telefone    VARCHAR (40),
    email       VARCHAR (120)
);

-- Tabela ESPECIALIDADE 
CREATE TABLE especialidade (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 196]
    nome        VARCHAR (80) UNIQUE NOT NULL [cite: 197]
);

-- Tabela LEITO
CREATE TABLE leito (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 256]
    ala         VARCHAR (40) NOT NULL, [cite: 259]
    numero      VARCHAR (10) NOT NULL, [cite: 261]
    -- O esquema Prisma usa 'codigo' e 'status', mas o DDL oficial tem 'ala', 'numero' e 'ocupado'
    ocupado     BOOLEAN NOT NULL DEFAULT FALSE, [cite: 263]
    UNIQUE (ala, numero) -- Restrição de unicidade na combinação [cite: 149, 265]
);

-- Tabela CONSULTA (FKs para Paciente e Médico) 
CREATE TABLE consulta (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 219]
    paciente_id BIGINT NOT NULL REFERENCES paciente (id) ON DELETE CASCADE, -- [cite: 222, 142]
    medico_id   BIGINT NOT NULL REFERENCES medico (id) ON DELETE RESTRICT, -- [cite: 224, 143]
    data_hora   TIMESTAMP NOT NULL, [cite: 227]
    motivo      VARCHAR (255),
    -- O DDL original usa status VARCHAR(20) NOT NULL DEFAULT 'AGENDADA'
    status      VARCHAR (20) NOT NULL DEFAULT 'AGENDADA',
    notas       TEXT -- O esquema Prisma adiciona 'notas' (como 'resultado_texto' em Exame)
);

-- Tabela INTERNACAO (FKs para Paciente e Leito) 
CREATE TABLE internacao (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 271]
    paciente_id BIGINT NOT NULL REFERENCES paciente (id) ON DELETE CASCADE, [cite: 273]
    leito_id    BIGINT NOT NULL REFERENCES leito (id) ON DELETE RESTRICT, [cite: 276, 277]
    entrada     TIMESTAMP NOT NULL, [cite: 282]
    alta        TIMESTAMP -- Pode ser NULL (indica internação ativa) [cite: 283]
);

-- Tabela EXAME (FK para Consulta)
CREATE TABLE exame (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 241]
    consulta_id BIGINT NOT NULL REFERENCES consulta (id) ON DELETE CASCADE, [cite: 243]
    tipo        VARCHAR (120) NOT NULL, [cite: 247]
    resultado_texto TEXT, -- O DDL original usa 'resultado_texto'[cite: 249], Prisma usa 'resultado'
    data_hora   TIMESTAMP -- Adicionado para flexibilidade, mas não está no DDL original.
);

-- Tabela PRESCRICAO (FK para Consulta) 
CREATE TABLE prescricao (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 290]
    consulta_id BIGINT NOT NULL REFERENCES consulta (id) ON DELETE CASCADE, [cite: 292]
    texto       TEXT NOT NULL [cite: 294, 296]
);

-- Tabela MEDICO_ESPECIALIDADE (Associação N:N) 
CREATE TABLE medico_especialidade (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    medico_id       BIGINT NOT NULL REFERENCES medico (id) ON DELETE CASCADE, [cite: 208]
    especialidade_id BIGINT NOT NULL REFERENCES especialidade (id) ON DELETE RESTRICT, [cite: 209, 210, 144]
    UNIQUE (medico_id, especialidade_id) [cite: 211]
);

-- Tabela ARQUIVO_CLINICO (Para dados binários - BLOB) 
CREATE TABLE arquivo_clinico (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, [cite: 302]
    paciente_id     BIGINT NOT NULL REFERENCES paciente (id) ON DELETE CASCADE, [cite: 305]
    nome_arquivo    VARCHAR(180) NOT NULL, [cite: 308]
    mime_type       VARCHAR (80) NOT NULL, [cite: 311]
    conteudo        BYTEA NOT NULL, -- Campo para dados binários (PDF, imagens) [cite: 131, 314]
    criado_em       TIMESTAMP NOT NULL DEFAULT now() [cite: 317]
);



---
-- 2.1. TRIGGER: Atualização Automática de Status do Leito

-- Função: Atualiza 'ocupado = TRUE' quando uma internação ativa é criada.
CREATE OR REPLACE FUNCTION Atualizar_Status_Leito_Internacao()
RETURNS TRIGGER AS $$
BEGIN
    -- Se é uma nova internação ou se a data de alta foi removida (o que reativa)
    IF NEW.data_alta IS NULL THEN
        -- Atualiza o leito como ocupado
        UPDATE leito
        SET ocupado = TRUE
        WHERE id = NEW.leito_id;
    END IF;

    -- Se é uma atualização e a data de alta foi definida (paciente saiu)
    IF OLD.data_alta IS NULL AND NEW.data_alta IS NOT NULL THEN
        -- Atualiza o leito como desocupado
        UPDATE leito
        SET ocupado = FALSE
        WHERE id = NEW.leito_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Executa a função após INSERT ou UPDATE em internacao
CREATE TRIGGER Leito_Ocupado_Apos_Internacao
AFTER INSERT OR UPDATE ON internacao
FOR EACH ROW
EXECUTE FUNCTION Atualizar_Status_Leito_Internacao();

---
-- 2.2. PROCEDURE (FUNCTION): Registrar Consulta Verificada

-- Função que registra uma consulta verificando se o médico possui a especialidade informada.
CREATE OR REPLACE FUNCTION Registrar_Consulta_Verificada(
    p_paciente_id BIGINT,
    p_medico_id BIGINT,
    p_data_hora TIMESTAMP,
    p_motivo VARCHAR(255),
    p_especialidade_nome VARCHAR(80)
)
RETURNS BIGINT AS $$
DECLARE
    v_especialidade_id BIGINT;
    v_consulta_id BIGINT;
BEGIN
    -- 1. Verifica se a especialidade existe
    SELECT id INTO v_especialidade_id FROM especialidade WHERE nome = p_especialidade_nome;

    IF v_especialidade_id IS NULL THEN
        RAISE EXCEPTION 'Especialidade "%" não encontrada.', p_especialidade_nome;
    END IF;

    -- 2. Verifica se o médico possui a especialidade
    IF NOT EXISTS (
        SELECT 1 FROM medico_especialidade ME
        WHERE ME.medico_id = p_medico_id AND ME.especialidade_id = v_especialidade_id
    ) THEN
        RAISE EXCEPTION 'Médico (ID: %) não possui a especialidade "%".', p_medico_id, p_especialidade_nome;
    END IF;

    -- 3. Insere a consulta
    INSERT INTO consulta (paciente_id, medico_id, data_hora, motivo, status)
    VALUES (p_paciente_id, p_medico_id, p_data_hora, p_motivo, 'AGENDADA')
    RETURNING id INTO v_consulta_id;

    RETURN v_consulta_id;
END;
$$ LANGUAGE plpgsql;

---
-- 2.3. VIEW: Internações Ativas Detalhadas

-- View que lista todas as internações ativas, incluindo detalhes do paciente, leito e o médico da última consulta.
CREATE VIEW Internacoes_Ativas_Detalhes AS
SELECT
    I.id AS InternacaoID,
    P.nome AS NomePaciente,
    P.cpf AS CPFPaciente,
    L.ala AS AlaLeito,
    L.numero AS NumeroLeito,
    I.entrada AS DataEntrada,
    M_Ultima.nome AS MedicoDaUltimaConsulta
FROM
    internacao I
JOIN
    paciente P ON I.paciente_id = P.id
JOIN
    leito L ON I.leito_id = L.id
LEFT JOIN LATERAL
    ( -- Subconsulta para encontrar o médico da última consulta antes da internação
        SELECT M.nome
        FROM consulta C
        JOIN medico M ON C.medico_id = M.id
        WHERE C.paciente_id = P.id AND C.data_hora < I.entrada
        ORDER BY C.data_hora DESC
        LIMIT 1
    ) AS M_Ultima ON TRUE
WHERE
    I.data_alta IS NULL; -- Filtra apenas internações ativas (sem data de alta)