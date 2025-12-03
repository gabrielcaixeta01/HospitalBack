// src/relatorios/relatorios.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

type InternacaoAtivaRow = {
  internacaoid: bigint;
  nomepaciente: string;
  cpfpaciente: string;
  alaleito: string;
  numeroleito: string;
  dataentrada: Date;
  medicodaultimaconsulta: string | null;
};

type InternacaoDetalhe = {
  internacaoId: number;
  pacienteId: number | null;
  pacienteNome: string | null;
  leitoId: number | null;
  leitoCodigo: string | null;
  dataEntrada: string | null;
  dataPrevistaAlta: string | null;
  medicoId: number | null;
  medicoNome: string | null;
  setor: string | null;
  observacoes: string | null;
};

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async internacoesAtivasDetalhes(): Promise<InternacaoDetalhe[]> {
    const rows = await this.prisma.$queryRaw<InternacaoAtivaRow[]>`
      SELECT
        internacaoid,
        nomepaciente,
        cpfpaciente,
        alaleito,
        numeroleito,
        dataentrada,
        medicodaultimaconsulta
      FROM internacoes_ativas_detalhes
    `;

    return rows.map((r: InternacaoAtivaRow) => ({
      internacaoId: Number(r.internacaoid),

      // não temos o id do paciente na view, então deixo null
      pacienteId: null,
      pacienteNome: r.nomepaciente,

      // idem para id do leito – se quiser mesmo, dá pra incluir L.id na view depois
      leitoId: null,
      leitoCodigo: `${r.alaleito} - ${r.numeroleito}`,

      dataEntrada:
        r.dataentrada instanceof Date
          ? r.dataentrada.toISOString()
          : (r.dataentrada as unknown as string),

      // por enquanto você não tem previsão de alta no banco
      dataPrevistaAlta: null,

      medicoId: null,
      medicoNome: r.medicodaultimaconsulta,

      setor: null,
      observacoes: null,
    }));
  }
}
