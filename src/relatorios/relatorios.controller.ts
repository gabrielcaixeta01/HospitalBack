import { Controller, Get } from "@nestjs/common";
import { RelatoriosService } from "./relatorios.service";

@Controller("relatorios")
export class RelatoriosController {
  constructor(private readonly service: RelatoriosService) {}

  @Get("internacoes-ativas-detalhes")
  internacoesAtivasDetalhes() {
    return this.service.internacoesAtivasDetalhes();
  }
}
