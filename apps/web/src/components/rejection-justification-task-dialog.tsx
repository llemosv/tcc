import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

interface RejectionJustificationTaskDialogProps {
  message: string
}

export function RejectionJustificationTaskDialog({
  message,
}: RejectionJustificationTaskDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Justificativa Reprovação</DialogTitle>
      </DialogHeader>
      <p className="text-md">{message}</p>
    </DialogContent>
  )
}
