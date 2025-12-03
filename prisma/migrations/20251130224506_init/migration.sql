-- DDL 

-- Tabela PACIENTE
CREATE TABLE paciente (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR (120) NOT NULL,
    cpf         VARCHAR (14) UNIQUE NOT NULL,
    nascimento  DATE NOT NULL,
    sexo        CHAR (1) CHECK (sexo IN ('M', 'F','O')),
    telefone    VARCHAR (40),
    email       VARCHAR (120),
    observacoes TEXT
);

-- Tabela MEDICO
CREATE TABLE medico (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR (120) NOT NULL,
    crm         VARCHAR (40) UNIQUE,
    telefone    VARCHAR (40),
    email       VARCHAR (120)
);

-- Tabela ESPECIALIDADE
CREATE TABLE especialidade (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR (80) UNIQUE NOT NULL
);

-- Tabela LEITO
CREATE TABLE leito (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ala         VARCHAR (40) NOT NULL,
    numero      VARCHAR (10) NOT NULL,
    ocupado     BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (ala, numero)
);

-- Tabela CONSULTA (FKs Paciente, Médico e Especialidade)
CREATE TABLE consulta (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    paciente_id     BIGINT NOT NULL REFERENCES paciente (id) ON DELETE CASCADE,
    medico_id       BIGINT NOT NULL REFERENCES medico (id) ON DELETE RESTRICT,
    especialidade_id BIGINT NOT NULL REFERENCES especialidade (id) ON DELETE RESTRICT,
    data_hora       TIMESTAMP NOT NULL,
    motivo          VARCHAR (255),
    status          VARCHAR (20) NOT NULL DEFAULT 'AGENDADA',
    notas           TEXT
);

-- Tabela INTERNACAO (FKs Paciente e Leito)
CREATE TABLE internacao (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    paciente_id BIGINT NOT NULL REFERENCES paciente (id) ON DELETE CASCADE,
    leito_id    BIGINT NOT NULL REFERENCES leito (id) ON DELETE RESTRICT,
    data_entrada     TIMESTAMP NOT NULL,
    data_alta        TIMESTAMP
);

-- Tabela EXAME (FK Consulta)
CREATE TABLE exame (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consulta_id BIGINT NOT NULL REFERENCES consulta (id) ON DELETE CASCADE,
    tipo        VARCHAR (120) NOT NULL,
    resultado_texto TEXT,
    data_hora   TIMESTAMP
);

-- Tabela PRESCRICAO (FK Consulta)
CREATE TABLE prescricao (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consulta_id BIGINT NOT NULL REFERENCES consulta (id) ON DELETE CASCADE,
    texto       TEXT NOT NULL
);

-- Tabela MEDICO_ESPECIALIDADE 
CREATE TABLE medico_especialidade (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    medico_id       BIGINT NOT NULL REFERENCES medico (id) ON DELETE CASCADE,
    especialidade_id BIGINT NOT NULL REFERENCES especialidade (id) ON DELETE RESTRICT,
    UNIQUE (medico_id, especialidade_id)
);

-- Tabela ARQUIVO_CLINICO 
CREATE TABLE arquivo_clinico (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    paciente_id     BIGINT NOT NULL REFERENCES paciente (id) ON DELETE CASCADE,
    nome_arquivo    VARCHAR(180) NOT NULL,
    mime_type       VARCHAR (80) NOT NULL,
    conteudo        BYTEA NOT NULL, 
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);




CREATE OR REPLACE FUNCTION Atualizar_Status_Leito_Internacao()
RETURNS TRIGGER AS $$
BEGIN
    
    IF TG_OP = 'INSERT' THEN
        
        UPDATE leito
        SET ocupado = TRUE
        WHERE id = NEW.leito_id;
    
   
    ELSIF TG_OP = 'UPDATE' THEN
        
        IF OLD.data_alta IS NULL AND NEW.data_alta IS NOT NULL THEN
            
            IF NOT EXISTS (
                SELECT 1 FROM internacao 
                WHERE leito_id = NEW.leito_id AND data_alta IS NULL AND id != NEW.id
            ) THEN
                UPDATE leito
                SET ocupado = FALSE
                WHERE id = NEW.leito_id;
            END IF;
        END IF;
        
        
        IF OLD.data_alta IS NOT NULL AND NEW.data_alta IS NULL THEN
            UPDATE leito
            SET ocupado = TRUE
            WHERE id = NEW.leito_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER Leito_Ocupado_Apos_Internacao
AFTER INSERT OR UPDATE ON internacao
FOR EACH ROW
EXECUTE FUNCTION Atualizar_Status_Leito_Internacao();


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
   
    SELECT id INTO v_especialidade_id FROM especialidade WHERE nome = p_especialidade_nome;

    IF v_especialidade_id IS NULL THEN
        RAISE EXCEPTION 'Especialidade "%" não encontrada.', p_especialidade_nome;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM medico_especialidade ME
        WHERE ME.medico_id = p_medico_id AND ME.especialidade_id = v_especialidade_id
    ) THEN
        RAISE EXCEPTION 'Médico (ID: %) não possui a especialidade "%".', p_medico_id, p_especialidade_nome;
    END IF;

    -- 3. Insere a consulta com a especialidade_id
    INSERT INTO consulta (paciente_id, medico_id, especialidade_id, data_hora, motivo, status)
    VALUES (p_paciente_id, p_medico_id, v_especialidade_id, p_data_hora, p_motivo, 'AGENDADA')
    RETURNING id INTO v_consulta_id;

    RETURN v_consulta_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE VIEW internacoes_ativas_detalhes AS
SELECT
    I.id            AS InternacaoID,
    P.nome          AS NomePaciente,
    P.cpf           AS CPFPaciente,
    L."codigo"      AS AlaLeito,      -- vem de leito."codigo"
    L."status"      AS NumeroLeito,   -- vem de leito."status"
    I."dataEntrada" AS DataEntrada,
    M_Ultima.nome   AS MedicoDaUltimaConsulta
FROM
    internacao I
JOIN
    paciente P ON I."pacienteId" = P.id    -- coluna real
JOIN
    leito L    ON I."leitoId"    = L.id    -- coluna real
LEFT JOIN LATERAL
    (
        SELECT M.nome
        FROM consulta C
        JOIN medico M ON C."medicoId" = M.id       -- coluna real
        WHERE C."pacienteId" = P.id                -- coluna real
          AND C."dataHora"   < I."dataEntrada"     -- coluna real
        ORDER BY C."dataHora" DESC
        LIMIT 1
    ) AS M_Ultima ON TRUE
WHERE
    I."dataAlta" IS NULL;       