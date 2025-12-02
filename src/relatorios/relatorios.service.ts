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

type InternacaoAtivaRelatorioDTO = {
  internacaoId: number;
  paciente: string; // o front usa .paciente
  leito: string; // o front usa .leito
  dataEntrada: string; // ISO
  previsaoAlta: string | null;
  medico: string | null; // o front usa .medico
  setor: string | null; // o front usa .setor
};

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async internacoesAtivasDetalhes(): Promise<InternacaoAtivaRelatorioDTO[]> {
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

    return rows.map((r) => ({
      internacaoId: Number(r.internacaoid),
      paciente: r.nomepaciente,
      leito: `${r.alaleito} - ${r.numeroleito}`, // monta string "A-201 - ocupado" ou só r.alaleito se preferir
      dataEntrada:
        r.dataentrada instanceof Date
          ? r.dataentrada.toISOString()
          : (r.dataentrada as unknown as string),
      previsaoAlta: null, // se não tiver coluna de previsão, manda null
      medico: r.medicodaultimaconsulta,
      setor: null, // se não tiver no banco, deixa null pro front mostrar "-"
    }));
  }
}
