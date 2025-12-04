import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

type InternacaoAtivaRow = {
  internacao_id: bigint;
  leitoId: bigint;
  nome_paciente: string;
  cpf_paciente: string;
  codigo_leito: string;
  status_leito: string;
  data_entrada: Date;
  medico_da_ultima_consulta: string | null;
};

type InternacaoDetalhe = {
  internacaoId: number;
  pacienteNome: string | null;
  cpf: string | null;
  leitoId: number | null;
  leitoCodigo: string | null;
  statusLeito: string | null;
  dataEntrada: string | null;
  medicoNome: string | null;
};

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async internacoesAtivasDetalhes(): Promise<InternacaoDetalhe[]> {
    const rows = await this.prisma.$queryRaw<InternacaoAtivaRow[]>`
      SELECT
        internacao_id,
        "leitoId",
        nome_paciente,
        cpf_paciente,
        codigo_leito,
        status_leito,
        data_entrada,
        medico_da_ultima_consulta
      FROM internacoes_ativas_detalhes
    `;

    return rows.map((r) => ({
      internacaoId: Number(r.internacao_id),

      pacienteNome: r.nome_paciente,
      cpf: r.cpf_paciente,

      leitoId: Number(r.leitoId),
      leitoCodigo: r.codigo_leito,
      statusLeito: r.status_leito,

      dataEntrada:
        r.data_entrada instanceof Date
          ? r.data_entrada.toISOString()
          : (r.data_entrada as any),

      medicoNome: r.medico_da_ultima_consulta,
    }));
  }
}