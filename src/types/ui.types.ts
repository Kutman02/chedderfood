import type { ElementType } from "react";

/* =========================
   NOTIFICATIONS
========================= */

export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};


/* =========================
   TAB CONFIGURATION
========================= */

export interface TabConfig {
  id: string;
  label: string;

  /**
   * React иконка компонента
   * пример: FaHome, FaUser
   */
  icon: ElementType;

  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}


/* =========================
   MODAL BASE PROPS
========================= */

export type ModalBaseProps = {
  open: boolean;
  onClose: () => void;
};


/* =========================
   BUTTON VARIANTS
========================= */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";


/* =========================
   DROPDOWN OPTION
========================= */

export type SelectOption<T = string> = {
  label: string;
  value: T;
};


/* =========================
   LOADING STATE
========================= */

export type LoadingState = {
  isLoading: boolean;
  error?: string | null;
};