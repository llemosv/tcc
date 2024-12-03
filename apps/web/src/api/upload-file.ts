import { api } from '@/lib/axios'

export interface UploadFile {
  id_topico: string
  file: File
}

export async function uploadFile({
  id_topico,
  file,
}: UploadFile): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)

  await api.post(`topics/upload/${id_topico}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
