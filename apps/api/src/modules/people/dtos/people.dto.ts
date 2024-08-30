import { z } from 'zod';

export const createPeopleSchema = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  fl_ativo: z.boolean(),
  id_tipo_pessoa: z.number().int(),
  id_courses: z.array(z.number().int()),
});

export type CreatePeopleDTO = z.infer<typeof createPeopleSchema>;
export type PeopleDTO = { id: number } & z.infer<typeof createPeopleSchema>;
