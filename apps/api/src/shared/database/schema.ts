import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

export const peopleTypes = pgTable('people_types', {
  id: serial('id').primaryKey(),
  tipo: varchar('tipo', { length: 50 }).notNull(),
});

export const people = pgTable('people', {
  id: serial('id').primaryKey(),
  nome: text('nome'),
  email: varchar('email', { length: 255 }).unique(),
  senha: text('senha'),
  fl_ativo: boolean('fl_ativo'),
  id_tipo_pessoa: integer('id_tipo_pessoa')
    .notNull()
    .references(() => peopleTypes.id),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  semesters: integer('semesters').notNull(),
});

export const peopleCourses = pgTable('people_courses', {
  people_id: integer('people_id')
    .notNull()
    .references(() => people.id),
  course_id: integer('course_id')
    .notNull()
    .references(() => courses.id),
});

export const tccGuidances = pgTable('tcc_guidances', {
  id: serial('id').primaryKey(),
  id_aluno_solicitante: integer('id_aluno_solicitante')
    .notNull()
    .references(() => people.id),
  id_professor_orientador: integer('id_professor_orientador')
    .notNull()
    .references(() => people.id),
  solicitacao_aceita: boolean('solicitacao_aceita').notNull(),
  tema: varchar('tema', { length: 255 }).notNull(),
  previsao_entrega: date('previsao_entrega').notNull(),
  justificativaReprovacao: text('justificativa_reprovacao'), // (opcional)
  data_aprovacao: date('data_aprovacao'), // (opcional)
  data_reprovacao: date('data_reprovacao'), //(opcional)
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  id_tcc: integer('id_tcc')
    .notNull()
    .references(() => tccGuidances.id),
  tarefa: varchar('tarefa', { length: 255 }).notNull(),
  data_criacao: date('data_criacao').notNull(),
  previsao_entrega: date('previsao_entrega').notNull(),
  data_finalizacao: date('data_finalizacao'), //(opcional)
});
