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

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async internacoesAtivasDetalhes() {
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
    `; // <<< repara: tudo minúsculo aqui

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
