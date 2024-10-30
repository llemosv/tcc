import { parse, startOfDay } from 'date-fns'

export function getColor(
  previsaoEntrega: string,
  dataPendenteRevisao: string | null,
  dataFinalizacao: string | null,
) {
  const date = parse(previsaoEntrega, 'dd/MM/yyyy', new Date())
  const actualDate = startOfDay(new Date())

  if (dataPendenteRevisao && !dataFinalizacao)
    return 'text-orange-500 font-semibold'
  if (dataFinalizacao) return 'text-emerald-500 font-semibold'
  if (date < actualDate) return 'text-red-500 font-semibold'
  if (date >= actualDate) return 'text-yellow-500 font-semibold'
}
