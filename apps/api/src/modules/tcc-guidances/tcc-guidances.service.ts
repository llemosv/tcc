import * as schema from 'src/shared/database/schema';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constrants/db.constants';
import { CreateTccGuidanceDTO } from './dtos/create-tcc-guidance.dto';
import { eq, sql } from 'drizzle-orm';
import { RespondGuidanceRequestDTO } from './dtos/respond-to-guidance-request.dto';
import { alias } from 'drizzle-orm/pg-core';

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

  async findGuidancesStudent(
    id: string,
    type: 'aluno' | 'orientador',
  ): Promise<any> {
    const alunoPeople = alias(schema.people, 'aluno');
    const orientadorPeople = alias(schema.people, 'orientador');

    const result = await this.database
      .select({
        id_orientacao: schema.tccGuidances.id,
        aluno: alunoPeople.nome,
        orientador: orientadorPeople.nome,
        tema: schema.tccGuidances.tema,
        previsao_entrega: sql<string>`TO_CHAR(${schema.tccGuidances.previsao_entrega}, 'DD/MM/YYYY')`,
        solicitacao_aceita: schema.tccGuidances.solicitacao_aceita,
        data_aprovacao: sql<string>`TO_CHAR(${schema.tccGuidances.data_aprovacao}, 'DD/MM/YYYY')`,
        data_reprovacao: sql<string>`TO_CHAR(${schema.tccGuidances.data_reprovacao}, 'DD/MM/YYYY')`,
        justificativa_reprovacao: schema.tccGuidances.justificativaReprovacao,
        total_atividades: sql<number>`COUNT(${schema.tasks.id})`,
      })
      .from(schema.tccGuidances)
      .innerJoin(
        alunoPeople,
        eq(alunoPeople.id, schema.tccGuidances.id_aluno_solicitante),
      )
      .innerJoin(
        orientadorPeople,
        eq(orientadorPeople.id, schema.tccGuidances.id_professor_orientador),
      )
      .leftJoin(schema.tasks, eq(schema.tasks.id_tcc, schema.tccGuidances.id))
      .where(
        type === 'aluno'
          ? eq(schema.tccGuidances.id_aluno_solicitante, id)
          : eq(schema.tccGuidances.id_professor_orientador, id),
      )
      .groupBy(
        schema.tccGuidances.id,
        alunoPeople.nome,
        orientadorPeople.nome,
        schema.tccGuidances.tema,
        schema.tccGuidances.previsao_entrega,
        schema.tccGuidances.solicitacao_aceita,
        schema.tccGuidances.data_aprovacao,
        schema.tccGuidances.data_reprovacao,
        schema.tccGuidances.justificativaReprovacao,
      );

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
