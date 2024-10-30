import { parse, startOfDay } from 'date-fns'

export function getStatus(
  previsaoEntrega: string,
  dataPendenteRevisao: string | null,
  dataFinalizacao: string | null,
) {
  const date = parse(previsaoEntrega, 'dd/MM/yyyy', new Date())
  const actualDate = startOfDay(new Date())

  if (dataPendenteRevisao && !dataFinalizacao)
    return 'Pendente Revisão Orientador'
  if (dataFinalizacao) return 'Entregue'
  if (date < actualDate) return 'Atrasado'
  if (date >= actualDate) return 'Pendente'
}
