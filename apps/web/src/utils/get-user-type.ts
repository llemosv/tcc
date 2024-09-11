import { useAuth } from '@/hooks/useAuth';

type UserType = 'coordenador' | 'orientador' | 'aluno';

export function getUserType(): UserType {
  const { user } = useAuth();

  if (user?.tipo_pessoa === '57e83fe5-bd2c-4473-bebc-b5de48095b32') return 'cordenador';
  if (user?.tipo_pessoa === 'b6a95883-9949-4d23-b220-1f3af6c8f7ea') return 'orientador';
  if (user?.tipo_pessoa === '842b617d-0558-4d48-89bc-a1b53f1c3c87') return 'aluno';

  // Lançar um erro se o tipo não for encontrado
  throw new Error('Tipo de pessoa desconhecido');
}
