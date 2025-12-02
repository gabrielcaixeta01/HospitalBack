import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

interface InternacaoAtivaViewRow {
  internacaoid: bigint;
  nomepaciente: string;
  cpfpaciente: string;
  alaleito: string;
  numeroleito: string;
  dataentrada: Date;
  medicodaultimaconsulta: string | null;
}

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async internacoesAtivasDetalhes() {
    const rows = await this.prisma.$queryRaw<InternacaoAtivaViewRow[]>`
      SELECT
        "InternacaoID"              AS "internacaoid",
        "NomePaciente"              AS "nomepaciente",
        "CPFPaciente"               AS "cpfpaciente",
        "AlaLeito"                  AS "alaleito",
        "NumeroLeito"               AS "numeroleito",
        "DataEntrada"               AS "dataentrada",
        "MedicoDaUltimaConsulta"    AS "medicodaultimaconsulta"
      FROM "Internacoes_Ativas_Detalhes"
    `;

    return rows.map((r) => ({
      internacaoId: Number(r.internacaoid),
      nomePaciente: r.nomepaciente,
      cpfPaciente: r.cpfpaciente,
      alaLeito: r.alaleito,
      numeroLeito: r.numeroleito,
      dataEntrada: r.dataentrada,
      medicoDaUltimaConsulta: r.medicodaultimaconsulta,
    }));
  }
}
