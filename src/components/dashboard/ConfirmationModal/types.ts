export interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: "warning" | "danger"
}

export type ConfirmationContentProps = Omit<
  ConfirmationModalProps,
  "isOpen"
>