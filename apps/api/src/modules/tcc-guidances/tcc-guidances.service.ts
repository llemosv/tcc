import * as schema from 'src/shared/database/schema';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constrants/db.constants';
import { CreateTccGuidanceDTO } from './dtos/create-tcc-guidance.dto';
import { sql } from 'drizzle-orm';
import { RespondGuidanceRequestDTO } from './dtos/respond-to-guidance-request.dto';

@Injectable()
export class TccGuidancesService {
  constructor(
    @Inject(DRIZZLE_ORM) private database: PostgresJsDatabase<typeof schema>,
  ) {}

  private readonly logger = new Logger(TccGuidancesService.name);

  async create(createSolicitationDto: CreateTccGuidanceDTO): Promise<void> {
    const {
      id_aluno_solicitante,
      id_professor_orientador,
      solicitacao_aceita,
      tema,
      previsao_entrega,
    } = createSolicitationDto;

    await this.database.insert(schema.tccGuidances).values({
      id_aluno_solicitante,
      id_professor_orientador,
      solicitacao_aceita,
      tema,
      previsao_entrega,
    });
  }

  async findGuidancesStudent(id_aluno: number): Promise<any> {
    const result = await this.database.execute(sql`
      SELECT tcc_guidances.id AS id_orientacao,
            aluno.nome AS aluno,
            prof.nome AS orientador,
            tcc_guidances.tema,
            TO_CHAR(tcc_guidances.previsao_entrega, 'DD/MM/YYYY') AS previsao_entrega,
            tcc_guidances.solicitacao_aceita,
            TO_CHAR(tcc_guidances.data_aprovacao, 'DD/MM/YYYY') AS data_aprovacao,
            TO_CHAR(tcc_guidances.data_reprovacao, 'DD/MM/YYYY') AS data_reprovacao,
            tcc_guidances.justificativa_reprovacao,
            COUNT(tasks.id) AS total_atividades
      FROM   tcc_guidances
            JOIN people AS aluno
              ON aluno.id = tcc_guidances.id_aluno_solicitante
            JOIN people AS prof
              ON prof.id = tcc_guidances.id_professor_orientador
            LEFT JOIN tasks 
              ON tasks.id_tcc = tcc_guidances.id
      WHERE  tcc_guidances.id_aluno_solicitante = ${id_aluno}
      GROUP BY tcc_guidances.id,
              aluno.nome,
              prof.nome,
              tcc_guidances.tema,
              tcc_guidances.previsao_entrega,
              tcc_guidances.solicitacao_aceita,
              tcc_guidances.data_aprovacao,
              tcc_guidances.data_reprovacao,
              tcc_guidances.justificativa_reprovacao;

    `);

    return result;
  }

  async respondToGuidanceRequest(
    id: number,
    respondGuidanceRequest: RespondGuidanceRequestDTO,
  ): Promise<any> {
    if (respondGuidanceRequest.accept) {
      return await this.database.execute(sql`
          UPDATE tcc_guidances SET solicitacao_aceita = true, data_aprovacao = CURRENT_DATE WHERE id = ${id}
      `);
    } else {
      return await this.database.execute(sql`
        UPDATE tcc_guidances SET solicitacao_aceita = false, data_reprovacao = CURRENT_DATE, justificativa_reprovacao = ${respondGuidanceRequest.justification} WHERE id = ${id}
    `);
    }
  }

  // async getSolicitations(id: string, solicitacao_aceita: string): Promise<any> {
  //   const solicitations = await this.solicitationModel
  //     .find({
  //       $and: [
  //         { solicitacao_aceita },
  //         {
  //           $or: [
  //             { data_reprovacao: { $exists: false } },
  //             { data_reprovacao: null },
  //           ],
  //         },
  //         {
  //           $or: [
  //             { id_aluno_solicitante: id },
  //             { id_professor_orientador: id },
  //           ],
  //         },
  //       ],
  //     })
  //     .populate('id_aluno_solicitante', 'nome')
  //     .populate('id_professor_orientador', 'nome')
  //     .select('nome_projeto descricao')
  //     .exec();

  //   if (solicitations.length === 0) {
  //     this.logger.warn('NENHUMA SOLICITAÇÃO ENCONTRADA!');

  //     throw new NotFoundException('Nenhuma solicitação encontrada!');
  //   }

  //   const formattedData = solicitations.map((solicitation: any) => ({
  //     id: solicitation._id,
  //     nome: solicitation.id_aluno_solicitante.nome,
  //     orientador: solicitation.id_professor_orientador.nome,
  //     descricao: `Tema: ${solicitation.nome_projeto}`,
  //     message: solicitation.descricao,
  //   }));

  //   this.logger.log('SOLICITAÇÕES BUSCADAS COM SUCESSO!');

  //   return formattedData;
  // }

  // async acceptSolicitation(id: string, accept: boolean): Promise<any> {
  //   const solicitationExists = await this.solicitationModel
  //     .findOne({ _id: id })
  //     .exec();

  //   if (!solicitationExists) {
  //     throw new NotFoundException(`Solicitação não encontrada!`);
  //   }

  //   if (accept) {
  //     return await this.solicitationModel
  //       .findOneAndUpdate(
  //         { _id: id },
  //         { $set: { solicitacao_aceita: true, data_aprovacao: new Date() } },
  //       )
  //       .exec();
  //   } else {
  //     return await this.solicitationModel
  //       .findOneAndUpdate(
  //         { _id: id },
  //         { $set: { solicitacao_aceita: false, data_reprovacao: new Date() } },
  //       )
  //       .exec();
  //   }
  // }
}
