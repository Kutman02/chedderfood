import type { ReactNode } from "react"
import { useModalRedirect } from "./hooks"

interface ModalRedirectWrapperProps {
  children: ReactNode
}

export const ModalRedirectWrapper = ({ children }: ModalRedirectWrapperProps) => {
  useModalRedirect()

  return <>{children}</>
}